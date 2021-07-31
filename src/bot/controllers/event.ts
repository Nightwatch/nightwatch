import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import {
  EventController as IEventController,
  GuildService,
  UserService
} from '../interfaces'
import { Message, GuildMember, Guild } from 'discord.js'
import { CommandoMessage, Command } from 'discord.js-commando'

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

  public readonly onCommandRun = async (
    _command: Command,
    _promise: any,
    message: CommandoMessage
  ) => {
    if (!config.bot.autoDeleteMessages.enabled || !message.deletable) {
      return Promise.resolve()
    }

    try {
      await message.delete({
        timeout: config.bot.autoDeleteMessages.delay
      })
    } catch (error) {
      return console.error(error)
    }
  }

  public readonly onGuildCreate = async (guild: Guild) => {
    try {
      await this.guildService
        .create(guild)
      const members = await guild.members.fetch()
      members.forEach(async (member) => {
        await this.userService.create(member.user).catch(console.error)
      })
    } catch (message) {
      return console.error(message)
    }
  }

  public readonly onGuildMemberAdd = (member: GuildMember) => {
    return this.userService.create(member.user).catch(console.error)
  }

  public readonly onCommandError = async (
    _command: Command,
    _error: Error,
    message: CommandoMessage
  ) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return Promise.resolve()
    }

    try {
      await this.userService
        .create(message.author)
        .catch(console.error)
        .then(() => this.guildService.create(message.guild))
    } catch (error) {
      return console.error(error)
    }
  }
}
