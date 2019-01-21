import { CommandoClient } from 'discord.js-commando'
import * as path from 'path'
import { Config, Types } from '../common'
import { readdirSync, statSync } from 'fs'
import { Bot as IBot, EventController } from './interfaces'
import { injectable, inject } from 'inversify'
import * as Promise from 'bluebird'
import { ClientUser } from 'discord.js'

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
    messageSweepInterval: 60
  })

  public start () {
    console.info(`Starting ${config.bot.botName}.`)

    this.registerEvents()
    this.registerCommands()
    return Promise.resolve(this.client.login(config.bot.token))
      .return()
      .catch(this.handleLoginFailure)
  }

  private handleLoginFailure(error: any) {
    console.error(error)
    console.warn('Failed to login, retrying in 5 seconds.')
    setTimeout(this.start, 5000)
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

  public stop (): void {
    this.client.destroy()
    process.exit(1)
  }

  public onReady = () => {
    const playingStatusOptions = config.bot.playingStatus.options
    const url = config.bot.playingStatus.url || 'https://twitch.tv/ihaxjoker'

    if (this.client.user) {
      const clientUser = this.client.user

      Promise.resolve(clientUser.setPresence({
        status: 'online',
        activity: {
          type: 'STREAMING',
          name: playingStatusOptions[0],
          url
        }
      }))
      .then(_ => setInterval(() => this.setRandomActivity(clientUser), config.bot.playingStatus.cycleIntervalMinutes * 1000 * 60))
      .catch(console.error)

    }

    console.info(`${config.bot.botName} ready.`)
  }

  private setRandomActivity(clientUser: ClientUser) {
    const playingStatusOptions = config.bot.playingStatus.options
    const url = config.bot.playingStatus.url || 'https://twitch.tv/ihaxjoker'
    return Promise.resolve(clientUser.setActivity({
      type: 'STREAMING',
      name: playingStatusOptions[Math.floor(Math.random() * playingStatusOptions.length)],
      url
    }))
      .catch(console.error)
  }

  public onDisconnect = () => {
    console.info(`${config.bot.botName} disconnected.`)

    if (!config.bot.autoReconnect) {
      process.exit(1)
    }

    console.info('Attempting to reconnect in 10 seconds.')
    setTimeout(this.start, 1000 * 10)
  }

  public onError = (error: Error) => {
    console.error(error)
    process.exit(1)
  }
}
