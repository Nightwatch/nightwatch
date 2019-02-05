import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../../../base'
import * as YouTube from 'simple-youtube-api'
import * as ytdl from 'ytdl-core'
import { Plugin } from '../..'

export default class PlayCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Play a song!',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'url',
          prompt: 'What\'s the url of the song you want to play?\n',
          type: 'string'
        }
      ],
      premiumOnly: true
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    const url = args.url as string

    const voiceChannel = msg.member.voice.channel

    if (!voiceChannel) {
      return msg.reply('You must be in a voice channel to use that command.')
    }

    const isPlaylist = !!url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)

    if (isPlaylist) {
      return msg.reply('Playlists aren\'t supported yet :/')
    }

    await voiceChannel.join()

    const youtube = new YouTube(Plugin.config.optional.googleApiKey)

    const video = await youtube.getVideo(url)

    voiceChannel.connection.play(ytdl(video.url))

    return msg.channel.send(`Playing ${video.title}`)
  }
}
