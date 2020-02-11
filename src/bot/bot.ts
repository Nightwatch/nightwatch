import { ClientUser } from 'discord.js'
import { inject, injectable } from 'inversify'
import * as path from 'path'
import { Config, Types } from '../common'
import { Bot as IBot, EventController } from './interfaces'
import { loadPlugins, PluginStatus } from './utils/plugin-loader'
import { Client } from 'bot-ts'

let pluginInfo: ReadonlyArray<PluginStatus> = []

const config: Config = require('../../config/config.json')

@injectable()
export class Bot implements IBot {
  @inject(Types.EventController)
  public readonly eventController: EventController

  public readonly client = new Client({
    ownerId: config.bot.ownerId,
    commandPrefix: config.bot.prefix,
    messageCacheLifetime: 30,
    messageSweepInterval: 60
  })

  public async start() {
    console.info(`Starting ${config.bot.botName}.`)

    this.registerEvents()
    await this.registerCommands()
    await this.client.login(config.bot.token).catch(this.handleLoginFailure)
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

  public async registerCommands() {
    return this.client.registerCommandsIn(path.join(__dirname, 'commands'))
  }

  public async stop() {
    await this.client.destroy()
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
          game: {
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

  private setRandomActivity(clientUser: ClientUser) {
    const playingStatusOptions = config.bot.playingStatus.options
    const url = config.bot.playingStatus.url || 'https://twitch.tv/ihaxjoker'
    return Promise.resolve(
      clientUser.setActivity(
        playingStatusOptions[
          Math.floor(Math.random() * playingStatusOptions.length)
        ],
        {
          type: 'STREAMING',
          url
        }
      )
    ).catch(console.error)
  }
}

export { pluginInfo }
