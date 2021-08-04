import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import {
  EventController as IEventController,
  GuildService,
  UserService
} from '../interfaces'
import { Message, GuildMember, Guild, MessageEmbed } from 'discord.js'
import { CommandoMessage, Command } from 'discord.js-commando'
import * as materialColors from 'material-colors'

const config: Config = require('../../../config/config.json')

@injectable()
export class EventController implements IEventController {
  @inject(Types.UserService) public readonly userService: UserService
  @inject(Types.GuildService) public readonly guildService: GuildService

  public readonly onMessage = async (message: Message) => {
    if (message.author.bot || message.channel.type !== 'text') {
      return Promise.resolve()
    }

    if (message.guild) {
      try {
        await this.guildService.saveMessage(message.guild.id, message.author.id, {
          content: message.content,
        })
      } catch (error) {
        console.log(error);
      }
    }
    
    console.log(`${message.author.username} (${message.author.id}): ${message.content}`);
  }

  public readonly onCommandRun = async (
    _command: Command,
    _promise: any,
    message: CommandoMessage
  ) => {
    console.log(`${message.author.username} (${message.author.id}): ${message.content}`);
    
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
      await this.guildService.create(guild)
      const members = await guild.members.fetch()
      members.forEach(async (member) => {
        await this.userService.create(member.user).catch(console.error)
        await this.guildService.createUser(guild.id, member.user.id, member)
      })
    } catch (message) {
      return console.error(message)
    }
  }

  public readonly onGuildMemberAdd = async (member: GuildMember) => {
    const guild = await this.guildService.create(member.guild)
    await this.userService.create(member.user)
    await this.guildService.createUser(member.guild.id, member.user.id, member)
    
    if (guild?.settings?.welcomeMessagesEnabled && guild.settings.welcomeMessage) {
      try {
        const dm = await member.createDM(true)

        const embed = new MessageEmbed()

        embed.setColor(materialColors.blue['500'])
        embed.setDescription(guild.settings.welcomeMessage)

        await dm.send(embed)
      } catch {
        // swallow
      }
    }
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
