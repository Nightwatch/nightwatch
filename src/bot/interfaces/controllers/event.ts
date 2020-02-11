import { GuildMember, Guild } from 'discord.js'
import * as Promise from 'bluebird'
import { Command, Message } from 'bot-ts'

export interface EventController {
  readonly onMessage: (message: Message) => Promise<void>
  readonly onCommandRun: (
    command: Command,
    promise: Promise<any>,
    message: Message
  ) => Promise<void>
  readonly onGuildCreate: (guild: Guild) => Promise<void>
  readonly onGuildMemberAdd: (member: GuildMember) => Promise<void>
  readonly onCommandError: (
    command: Command,
    error: Error,
    message: Message
  ) => Promise<void>
}
