import { CommandoClient } from 'discord.js-commando'
import { SongQueue } from './guild'

export class Client extends CommandoClient {
  public songQueues: Map<string, SongQueue> = new Map()
}
