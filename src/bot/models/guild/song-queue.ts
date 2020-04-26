import { TextChannel, VoiceChannel, VoiceConnection } from 'discord.js'
import { Video } from 'popyt'

export class SongQueue {
  public textChannel: TextChannel

  public connection: VoiceConnection
  public songs: Video[] = []
  public volume = 5
  public playing = false
  public votesToSkip: string[] = []

  constructor(
    public readonly guildId: string,
    public voiceChannel: VoiceChannel
  ) {}

  public addSong(song: Video) {
    this.songs.push(song)
  }
  public removeSong(song: Video) {
    this.songs = this.songs.filter((_x, i) => i !== this.songs.indexOf(song))
  }
}
