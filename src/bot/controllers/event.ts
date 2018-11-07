import { inject, injectable } from 'inversify'
import { Types } from '../constants/types'
import { EventController as IEventController, GuildService, UserService } from '../interfaces'
import { Message, GuildMember, Guild } from 'discord.js'
import { CommandMessage } from 'discord.js-commando'
import { Config } from '../../common'

const config: Config = require('../../../config/config.json')

@injectable()
export class EventController implements IEventController {
  @inject(Types.UserService) public userService: UserService
  @inject(Types.GuildService) public guildService: GuildService

  public onMessage = async (message: Message) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return
    }
  }

  public onCommandRun = async (
    _command: CommandMessage,
    _promise: Promise<any>,
    message: CommandMessage
  ) => {
    if (config.bot.autoDeleteMessages.enabled && message.deletable) {
      await message.delete(config.bot.autoDeleteMessages.delay).catch(console.error)
    }
  }

  public onGuildCreate = async (guild: Guild) => {
    await this.guildService.createGuild(guild).catch(console.error)
    guild.members.forEach(member => this.userService.createUser(member))
  }

  public onGuildMemberAdd = async (member: GuildMember) => {
    await this.userService.createUser(member)
  }
}
