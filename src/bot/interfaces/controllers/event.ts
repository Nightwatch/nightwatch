import { Message, GuildMember, Guild } from 'discord.js'
import { CommandoMessage, Command } from 'discord.js-commando'
import {User} from '../../../db'

export interface EventController {
  readonly onMessage: (message: Message) => Promise<void>
  readonly onCommandRun: (
    command: Command,
    promise: Promise<any>,
    message: CommandoMessage
  ) => Promise<void>
  readonly onGuildCreate: (guild: Guild) => Promise<void>
  readonly onGuildMemberAdd: (member: GuildMember) => Promise<User | void>
  readonly onCommandError: (
    command: Command,
    error: Error,
    message: CommandoMessage,
    ...args: any
  ) => Promise<void>
}
