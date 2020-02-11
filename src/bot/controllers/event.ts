import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import {
  EventController as IEventController,
  GuildService,
  UserService
} from '../interfaces'
import { Message, GuildMember, Guild } from 'discord.js'
import { CommandMessage, Command } from 'discord.js-commando'
import * as Promise from 'bluebird'

const config: Config = require('../../../config/config.json')

@injectable()
export class EventController implements IEventController {
  @inject(Types.UserService) public readonly userService: UserService
  @inject(Types.GuildService) public readonly guildService: GuildService

  public readonly onMessage = (message: Message) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return Promise.resolve()
    }

    return Promise.resolve()
  }

  public readonly onCommandRun = (
    _command: CommandMessage,
    _promise: Promise<any>,
    message: CommandMessage
  ) => {
    if (!config.bot.autoDeleteMessages.enabled || !message.deletable) {
      return Promise.resolve()
    }

    return Promise.resolve(message.delete(config.bot.autoDeleteMessages.delay))
      .thenReturn()
      .catch(console.error)
  }

  public readonly onGuildCreate = (guild: Guild) => {
    return this.guildService
      .create(guild)
      .then(() => {
        guild.members.forEach(async member => {
          await this.userService.create(member.user).catch(console.error)
        })
      })
      .catch(console.error)
  }

  public readonly onGuildMemberAdd = (member: GuildMember) => {
    return this.userService.create(member.user).catch(console.error)
  }

  public readonly onCommandError = (
    _command: Command,
    _error: Error,
    message: CommandMessage
  ) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return Promise.resolve()
    }

    return this.userService
      .create(message.author)
      .thenReturn()
      .catch(console.error)
      .then(() => this.guildService.create(message.guild))
      .thenReturn()
      .catch(console.error)
  }
}
