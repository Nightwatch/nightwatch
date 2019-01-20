import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import { EventController as IEventController, GuildService, UserService } from '../interfaces'
import { Message, GuildMember, Guild, User } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'

const config: Config = require('../../../config/config.json')

@injectable()
export class EventController implements IEventController {
  @inject(Types.UserService) public userService: UserService
  @inject(Types.GuildService) public guildService: GuildService

  public onMessage = async (message: Message) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return
    }

    await this.createUserIfNotExists(message.author)
  }

  public onCommandRun = async (
    _command: CommandoMessage,
    _promise: Promise<any>,
    message: CommandoMessage
  ) => {
    if (config.bot.autoDeleteMessages.enabled && message.deletable) {
      await message.delete(config.bot.autoDeleteMessages.delay).catch(console.error)
    }
  }

  public onGuildCreate = async (guild: Guild) => {
    await this.guildService.create(guild).catch(console.error)
    guild.members.forEach(async member => {
      await this.userService.create(member.user).catch(console.error)
    })
  }

  public onGuildMemberAdd = async (member: GuildMember) => {
    await this.userService.create(member.user).catch(console.error)
  }

  private createUserIfNotExists = async (author: User) => {
    const user = await this.userService.find(author.id)

    if (!user) {
      await this.userService.create(author).catch(console.error)
    }
  }
}
