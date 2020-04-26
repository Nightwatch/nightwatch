import { CommandoClient } from 'discord.js-commando'
import { SongQueue } from './guild'
import { MusicPlayer } from '../commands/music/music-player'

export class Client extends CommandoClient {
  public songQueues: Map<string, SongQueue> = new Map()
  public musicPlayer = new MusicPlayer(this)
}
