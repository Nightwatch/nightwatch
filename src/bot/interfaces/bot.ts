import { CommandoClient } from 'discord.js-commando'
import * as Promise from 'bluebird'

export interface Bot {
  client: CommandoClient
  start: () => Promise<void>
  registerEvents: () => void
  registerCommands: () => void
  stop: () => void
  onDisconnect: () => void
  onError: (error: Error) => void
}
