import { CommandoClient } from 'discord.js-commando'
import * as Promise from 'bluebird'

export interface Bot {
  readonly client: CommandoClient
  readonly start: () => Promise<void>
  readonly registerEvents: () => void
  readonly registerCommands: () => void
  readonly stop: () => void
  readonly onDisconnect: () => void
  readonly onError: (error: Error) => void
}
