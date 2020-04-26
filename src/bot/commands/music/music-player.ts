import { Client } from '../../models'
import {
  TextChannel,
  VoiceChannel,
  Role,
  VoiceConnection,
  StreamDispatcher,
  Message
} from 'discord.js'
import ytdl = require('ytdl-core')

export class MusicPlayer {
  public stopped = false
  public informNowplaying = true
  public queue: Array<{ id: string; title: string; user: string }> = []
  public aliases = {}
  public voiceConnection?: VoiceConnection
  public voiceHandler?: StreamDispatcher
  public textChannel?: TextChannel
  public voiceChannel?: VoiceChannel
  public requiredRole?: Role
  private volume = 5

  constructor(private readonly client: Client) {}

  public isQueueEmpty = () => !this.queue[0] || this.queue.length === 0

  public isPlaying = () => this.voiceHandler !== undefined

  public getVideoId = (string: string) => {
    const regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/
    const matches = string.match(regex)

    if (matches) {
      return matches[1]
    }
    return string
  }

  public playNextSong = async () => {
    if (this.isQueueEmpty()) {
      return this.textChannel!.sendMessage('The queue is empty!')
    }

    this.stopped = false

    const connection = await this.voiceChannel!.join()
    this.voiceConnection = connection

    const videoId = this.queue[0].id
    const title = this.queue[0].title
    const user = this.queue[0].user

    const embed = {
      title: ' ',
      color: 0x2196f3,
      author: {
        name: 'Now playing: ' + title,
        icon_url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
      },
      thumbnail: {
        url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
      },
      fields: [
        {
          name: 'Link',
          value:
            '[Click Here](' +
            'https://www.youtube.com/watch?v=' +
            videoId +
            ')',
          inline: true
        },
        {
          name: 'Requested By',
          value: user,
          inline: true
        }
      ],
      footer: {
        text: 'Nightwatch'
      }
    }

    if (this.queue.length > 1) {
      embed.fields.push({
        name: 'Up Next',
        value: this.queue[1].title,
        inline: false
      })
    }

    await this.client.user.setGame(title)

    const audioStream = ytdl('https://www.youtube.com/watch?v=' + videoId)
    this.voiceHandler = this.voiceConnection.playStream(audioStream)
    this.setVolume(this.volume)
    this.queue.shift()

    this.voiceHandler.once('end', async () => {
      setTimeout(async () => {
        this.voiceHandler?.end()
        this.voiceHandler = undefined
        if (!this.isPlaying() && !this.stopped && this.queue.length > 0) {
          await this.playNextSong()
        } else if (!this.isPlaying() && this.isQueueEmpty()) {
          this.voiceChannel!.leave()
        }
      }, 2000)
    })

    return this.textChannel!.send({ embed })
  }

  public addToQueue = async (video: string, message: Message) => {
    const videoId = this.getVideoId(video)

    try {
      const info = await ytdl.getInfo(
        'https://www.youtube.com/watch?v=' + videoId
      )

      this.queue.push({
        title: info.title,
        id: videoId,
        user: message.author.username
      })

      if (!this.stopped && !this.isPlaying() && this.queue.length > 0) {
        return this.playNextSong()
      } else if (!this.stopped && this.isPlaying() && this.queue.length === 1) {
        const embed = {
          title: ' ',
          color: 0x2196f3,
          author: {
            name: 'Up next: ' + this.queue[0].title,
            icon_url:
              'https://img.youtube.com/vi/' +
              this.queue[0].id +
              '/hqdefault.jpg'
          },
          thumbnail: {
            url:
              'https://img.youtube.com/vi/' +
              this.queue[0].id +
              '/hqdefault.jpg'
          },
          fields: [
            {
              name: 'Link',
              value:
                '[Click Here](' +
                'https://www.youtube.com/watch?v=' +
                this.queue[0].id +
                ')',
              inline: true
            },
            {
              name: 'Requested By',
              value: this.queue[0].user,
              inline: true
            }
          ],
          footer: {
            text: 'Nightwatch'
          }
        }

        return message.channel.send({ embed })
      }

      return message.reply('"' + info.title + '" has been added to the queue.')
    } catch {
      return message.reply(
        'The requested video (' +
          videoId +
          ') does not exist or cannot be played.'
      )
    }
  }

  public stop() {
    this.stopped = true
    this.voiceHandler?.end()
  }

  public get nowPlaying() {
    return this.queue[0]
  }

  public getVolume() {
    return this.volume
  }

  public incrementVolume() {
    this.volume++

    if (this.volume > 10) {
      this.volume = 10
    }

    this.setVolume(this.volume)
  }

  public decrementVolume() {
    this.volume--

    if (this.volume < 0) {
      this.volume = 0
    }

    this.setVolume(this.volume)
  }

  public setVolume(volume: number) {
    this.volume = volume
    this.voiceHandler?.setVolumeLogarithmic(volume / 5)
  }

  public pause() {
    this.voiceHandler?.pause()
  }

  public get paused() {
    return this.voiceHandler?.paused
  }

  public resume() {
    this.voiceHandler?.resume()
  }

  public get playing() {
    return this.voiceHandler && this.nowPlaying && !this.paused
  }
}
