import { Client } from '../models'

export interface Bot {
  readonly client: Client
  readonly start: () => Promise<void>
  readonly registerEvents: () => void
  readonly registerCommands: () => void
  readonly stop: () => void
  readonly onDisconnect: () => void
  readonly onError: (error: Error) => void
}
