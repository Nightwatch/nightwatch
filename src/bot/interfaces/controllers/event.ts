import { Message, GuildMember, Guild } from 'discord.js'
import { CommandMessage, Command } from 'discord.js-commando'
import * as Promise from 'bluebird'

export interface EventController {
  readonly onMessage: (message: Message) => Promise<void>
  readonly onCommandRun: (
    command: CommandMessage,
    promise: Promise<any>,
    message: CommandMessage
  ) => Promise<void>
  readonly onGuildCreate: (guild: Guild) => Promise<void>
  readonly onGuildMemberAdd: (member: GuildMember) => Promise<void>
  readonly onCommandError: (
    command: Command,
    error: Error,
    message: CommandMessage
  ) => Promise<void>
}
