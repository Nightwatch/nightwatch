import { Message, GuildMember, Guild } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import * as Promise from 'bluebird'

export interface EventController {
  onMessage: (message: Message) => Promise<void>
  onCommandRun: (command: CommandoMessage, promise: Promise<any>, message: CommandoMessage) => Promise<void>
  onGuildCreate: (guild: Guild) => Promise<void>
  onGuildMemberAdd: (member: GuildMember) => Promise<void>
}
