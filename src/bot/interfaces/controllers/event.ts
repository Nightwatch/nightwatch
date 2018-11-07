import { Message, GuildMember, Guild } from 'discord.js'
import { CommandMessage } from 'discord.js-commando'

export interface EventController {
  onMessage: (message: Message) => Promise<void>
  onCommandRun: (command: CommandMessage, promise: Promise<any>, message: CommandMessage) => Promise<void>
  onGuildCreate: (guild: Guild) => Promise<void>
  onGuildMemberAdd: (member: GuildMember) => Promise<void>
}
