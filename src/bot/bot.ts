import { CommandoClient } from 'discord.js-commando'
import * as path from 'path'
import { Config } from '../common'
import { readdirSync, statSync } from 'fs'
import { Bot as IBot, EventController } from './interfaces'
import { Types } from './constants'
import { injectable, inject } from 'inversify'

const getDirectoryNames = (p: string) => readdirSync(p).filter(f => statSync(path.join(p, f)).isDirectory())
const upperCaseFirstLetter = (s: string) => s[0].toUpperCase() + s.substring(1)

const config: Config = require('../../config/config.json')

@injectable()
export class Bot implements IBot {
  @inject(Types.EventController) public eventController: EventController

  public client: CommandoClient = new CommandoClient({
    owner: config.bot.ownerId,
    commandPrefix: config.bot.prefix,
    messageCacheLifetime: 30,
    messageSweepInterval: 60,
    unknownCommandResponse: false
  })

  public async start () {
    console.info(`Starting ${config.bot.botName}.`)

    this.registerEvents()
    this.registerCommands()
    await this.login()
  }

  public registerEvents() {
    this.client.on('ready', this.onReady)
    this.client.on('disconnect', this.onDisconnect)
    this.client.on('error', this.onError)
    this.client.on('message', this.eventController.onMessage)
    this.client.on('commandRun', this.eventController.onCommandRun)
    this.client.on('guildCreate', this.eventController.onGuildCreate)
    this.client.on('guildMemberAdd', this.eventController.onGuildMemberAdd)
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
      await this.client.login(config.bot.token)
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
          name: config.bot.playingStatus,
          url: 'https://twitch.tv/ihaxjoker',
          type: 'STREAMING'
        }
      })
      .catch((error: Error) => console.error(error))

    console.info(`${config.bot.botName} ready.`)
  }

  public onDisconnect = async () => {
    console.info(`${config.bot.botName} disconnected.`)

    if (!config.bot.autoReconnect) {
      process.exit(1)
    }

    console.info('Attempting to reconnect in 10 seconds.')
    setTimeout(this.start, 1000 * 10)
  }

  public onError = async (error: Error) => {
    console.error(error)
    setTimeout(this.start, 5000)
  }
}
