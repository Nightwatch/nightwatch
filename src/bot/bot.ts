import { ClientUser, Intents } from 'discord.js'
import { readdirSync, statSync } from 'fs'
import { inject, injectable } from 'inversify'
import * as path from 'path'
import { Config, Types } from '../common'
import { Bot as IBot, EventController } from './interfaces'
import { loadPlugins, PluginStatus } from './utils/plugin-loader'
import { Client } from './models/client'
import { GuildService, UserService } from './services'

const getDirectoryNames = (p: string) =>
  readdirSync(p).filter(f => statSync(path.join(p, f)).isDirectory())
const upperCaseFirstLetter = (s: string) => s[0].toUpperCase() + s.substring(1)

let pluginInfo: ReadonlyArray<PluginStatus> = []

const config: Config = require('../../config/config.json')

@injectable()
export class Bot implements IBot {
  @inject(Types.EventController)
  public readonly eventController: EventController

  public readonly client: Client = new Client({
    owner: config.bot.ownerId,
    commandPrefix: config.bot.prefix,
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    fetchAllMembers: true,
    ws: {
      intents: new Intents([
        'DIRECT_MESSAGES',
        'GUILDS',
        'GUILD_BANS',
        'GUILD_INVITES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'GUILD_PRESENCES',
        'GUILD_EMOJIS',
        'GUILD_INTEGRATIONS',
        'GUILD_VOICE_STATES',
        'GUILD_WEBHOOKS'
      ]),
    }
  })

  public async start() {
    console.info(`Starting ${config.bot.botName}.`)

    const guildService = new GuildService()
    const userService = new UserService()

    this.registerEvents()
    this.registerCommands()
    await this.client.login(config.bot.token)
      .catch(this.handleLoginFailure)

    const guilds = this.client.guilds.cache;

    for (let guild of guilds.values()) {
      await guildService.create(guild)
      const members = await guild.members.fetch()

      for (let member of members.values()) {
        await userService.create(member.user)
        await guildService.createUser(guild.id, member.user.id, member)
      }
    }
  }

  public registerEvents() {
    this.client.on('ready', this.onReady)
    this.client.on('disconnect', this.onDisconnect)
    this.client.on('error', this.onError)
    this.client.on('message', this.eventController.onMessage)
    this.client.on('commandRun', this.eventController.onCommandRun)
    this.client.on('guildCreate', this.eventController.onGuildCreate)
    this.client.on('guildMemberAdd', this.eventController.onGuildMemberAdd)
    this.client.on('commandError', this.eventController.onCommandError)
  }

  public registerCommands() {
    const commandGroups = getDirectoryNames(
      path.join(__dirname, 'commands')
    ).map(name => [name, upperCaseFirstLetter(name)])

    this.client.registry
      .registerDefaultTypes()
      .registerGroups(commandGroups)
      .registerDefaultGroups()
      .registerDefaultCommands()
      .registerCommandsIn(path.join(__dirname, 'commands'))
  }

  public stop(): void {
    this.client.destroy();
    process.exit(1)
  }

  public readonly onReady = () => {
    const playingStatusOptions = config.bot.playingStatus.options
    const url = config.bot.playingStatus.url || 'https://twitch.tv/ihaxjoker'

    if (this.client.user) {
      const clientUser = this.client.user

      Promise.resolve(
        clientUser.setPresence({
          status: 'online',
          activity: {
            type: 'STREAMING',
            name: playingStatusOptions[0],
            url
          }
        })
      )
        .then(_ =>
          setInterval(
            () => this.setRandomActivity(clientUser),
            config.bot.playingStatus.cycleIntervalMinutes * 1000 * 60
          )
        )
        .catch(console.error)
    }

    loadPlugins(this.client, config)
      .then(pluginStatuses => {
        pluginInfo = pluginStatuses
      })
      .catch(console.error)

    console.info(`${config.bot.botName} ready.`)
  }

  public readonly onDisconnect = () => {
    console.info(`${config.bot.botName} disconnected. Restarting...`)

    process.exit(1)
  }

  public readonly onError = (error: Error) => {
    console.error(error)

    process.exit(1)
  }

  private handleLoginFailure(error: any) {
    console.error(error)
    console.warn('Failed to login, retrying in 5 seconds.')
    setTimeout(this.start, 5000)
  }

  private async setRandomActivity(clientUser: ClientUser) {
    const playingStatusOptions = config.bot.playingStatus.options
    const url = config.bot.playingStatus.url || 'https://twitch.tv/ihaxjoker'
    await clientUser.setActivity(
      playingStatusOptions[
        Math.floor(Math.random() * playingStatusOptions.length)
      ],
      {
        type: 'STREAMING',
        url
      }
    ).catch(console.error)
  }
}

export { pluginInfo }
