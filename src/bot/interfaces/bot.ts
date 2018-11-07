import { CommandoClient } from 'discord.js-commando'

export interface Bot {
  client: CommandoClient
  start: () => Promise<void>
  registerEvents: () => void
  registerCommands: () => void
  login: () => Promise<void>
  stop: () => void
  onDisconnect: () => Promise<void>
  onError: (error: Error) => Promise<void>
}
