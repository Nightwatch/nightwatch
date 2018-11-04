import { Message, Guild, GuildMember } from 'discord.js'
import { CommandoClient, CommandMessage } from 'discord.js-commando'
import * as path from 'path'
import { Config } from '../common'
import { readdirSync, statSync } from 'fs'
import { container } from './config/inversify'
import { GuildService } from './interfaces'
import { Types } from './constants'
import { UserService } from './services'

const getDirectoryNames = (p: string) => readdirSync(p).filter(f => statSync(path.join(p, f)).isDirectory())
const upperCaseFirstLetter = (s: string) => s[0].toUpperCase() + s.substring(1)

const config: Config = require('../../config/config.json')
const { ownerId, prefix, token, botName, playingStatus, autoReconnect, autoDeleteMessages } = config.bot

export class Bot {
  public client: CommandoClient = new CommandoClient({
    owner: ownerId,
    commandPrefix: prefix,
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    unknownCommandResponse: false
  })

  public async start () {
    console.info(`Starting ${botName}.`)

    this.registerEvents()
    this.registerCommands()
    await this.login()
  }

  public registerEvents() {
    this.client.on('ready', this.onReady)
    this.client.on('disconnect', this.onDisconnect)
    this.client.on('message', this.onMessage)
    this.client.on('error', this.onError)
    this.client.on('commandRun', this.onCommandRun)
    this.client.on('guildCreate', this.onGuildCreate)
    this.client.on('guildMemberAdd', this.onGuildMemberAdd)
  }

  public registerCommands() {
    const commandGroups = getDirectoryNames(path.join(__dirname, 'commands'))
    .map(name => [name, upperCaseFirstLetter(name)])

    this.client.registry
    .registerDefaultTypes()
    .registerGroups(commandGroups)
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'))
  }

  public async login() {
    try {
      await this.client.login(token)
    } catch (error) {
      console.error(error)
      console.warn('Failed to login, retrying in 5 seconds.')
      setTimeout(this.start, 5000)
    }
  }

  public stop (): void {
    this.client.destroy()
    process.exit(1)
  }

  public onReady = async () => {
    await this.client.user
      .setPresence({
        status: 'online',
        activity: {
          name: playingStatus,
          url: 'https://twitch.tv/ihaxjoker',
          type: 'STREAMING'
        }
      })
      .catch((error: Error) => console.error(error))

    console.info(`${botName} ready.`)
  }

  public onError = async (error: Error) => {
    console.error(error)
    setTimeout(this.start, 5000)
  }

  public onMessage = async (message: Message) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return
    }
  }

  public onDisconnect = async () => {
    console.info(`${botName} disconnected.`)

    if (!autoReconnect) {
      process.exit(1)
    }

    console.info('Attempting to reconnect in 10 seconds.')
    setTimeout(this.start, 1000 * 10)
  }

  public onCommandRun = async (
    _command: CommandMessage,
    _promise: Promise<any>,
    message: CommandMessage
  ) => {
    if (autoDeleteMessages.enabled && message.deletable) {
      await message.delete(autoDeleteMessages.delay).catch(console.error)
    }
  }

  public onGuildCreate = async (guild: Guild) => {
    const guildService = container.get<GuildService>(Types.GuildService)
    await guildService.createGuild(guild).catch(console.error)
    const userService = container.get<UserService>(Types.UserService)
    guild.members.forEach(member => userService.createUser(member))
  }

  public onGuildMemberAdd = async (member: GuildMember) => {
    const userService = container.get<UserService>(Types.UserService)
    await userService.createUser(member)
  }
}
