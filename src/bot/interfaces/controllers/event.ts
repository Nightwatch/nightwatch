import { Message, GuildMember, Guild } from 'discord.js'
import { CommandoMessage, Command } from 'discord.js-commando'
import * as Promise from 'bluebird'

export interface EventController {
  readonly onMessage: (message: Message) => Promise<void>
  readonly onCommandRun: (
    command: CommandoMessage,
    promise: Promise<any>,
    message: CommandoMessage
  ) => Promise<void>
  readonly onGuildCreate: (guild: Guild) => Promise<void>
  readonly onGuildMemberAdd: (member: GuildMember) => Promise<void>
  readonly onCommandError: (
    command: Command,
    error: Error,
    message: CommandoMessage
  ) => Promise<void>
}
