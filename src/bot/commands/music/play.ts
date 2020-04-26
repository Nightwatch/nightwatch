import { RichEmbed, Collection, Message, Guild, VoiceChannel } from 'discord.js'
import { CommandMessage } from 'discord.js-commando'
import { Config } from '../../../common'
import { Command } from '../../base'
import { YouTube, Video } from 'popyt'
import { Client } from '../../models'
import { stripIndents } from 'common-tags'
import * as ytdl from 'ytdl-core'
import { SongQueue } from '../../models/guild/song-queue'

const config: Config = require('../../../../config/config.json')
const youtube = new YouTube(config.optional.googleApiKey)

export default class PlayCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Add a song to the song queue.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'search',
          prompt: 'What song would you like to play?\n',
          type: 'string',
          default: '-1'
        }
      ],
      hidden:
        !config.optional.googleApiKey || !config.optional.googleApiKey.trim()
    })
  }

  public async run(msg: CommandMessage, args: { search: string }) {
    const serverQueue = this.client.songQueues.get(msg.guild.id)
    const voiceChannel = msg.member.voiceChannel

    if (!voiceChannel) {
      return msg.reply(`You must be in a voice channel to play music.`)
    }

    if (args.search === '-1') {
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true
        serverQueue.connection.dispatcher.resume()

        return msg.reply('The music will now resume.')
      } else {
        return msg.reply('Nothing is paused.')
      }
    }

    if (
      args.search.match(
        /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/
      )
    ) {
      const playlist = await youtube.getPlaylist(args.search)

      if (!playlist) {
        return msg.reply('Playlist not found.')
      }

      const responseMsg = (await msg.channel.send(
        `🕙 Adding playlist **${playlist.title}** to the queue... ${
          playlist.length >= 100 ? 'This may take a while.' : ''
        }`
      )) as Message

      const videos = await playlist.fetchVideos()

      for (const video of videos) {
        if (video.private) {
          await video.fetch().catch(() => {
            // It's private
          })
        }

        if (!video.private) {
          await handleVideo(video, msg, voiceChannel, this.client, true)
        }
      }

      if (responseMsg) {
        return responseMsg.edit(
          `✅ Playlist: **${playlist.title}** has been added to the queue!`
        )
      }

      return msg.channel.send('')
    }

    let youtubeVideo = await youtube.getVideo(args.search)

    if (youtubeVideo) {
      return handleVideo(youtubeVideo, msg, voiceChannel, this.client)
    }

    const searchResults = await youtube.searchVideos(args.search)

    if (!searchResults || searchResults.results.length === 0) {
      return msg.channel.send('🆘 I could not obtain any search results.')
    }

    let index = 0
    const description = stripIndents`${searchResults.results
      // tslint:disable-next-line: no-nested-template-literals
      .map(video2 => `**${++index} -** ${video2.title}`)
      .join('\n')}`
    const embed = new RichEmbed()
      .setColor('BLUE')
      .setAuthor(
        msg.author.username,
        msg.author.displayAvatarURL,
        `${config.api.address}/users/${msg.author.id}`
      )
      .setTitle('Song Selection')
      .setFooter(
        'Please provide a value to select one of the search results ranging from 1-10.'
      )
      .setDescription(description)
      .setThumbnail(this.client.user.displayAvatarURL)

    await msg.channel.send(embed)

    const response: Collection<
      string,
      Message
    > | void = await msg.channel.awaitMessages(
      msg2 => msg2.content > 0 && msg2.content < 11,
      {
        max: 1,
        time: 10000,
        errors: ['time']
      }
    )

    if (!response) {
      return msg.channel.send(
        'No or invalid value entered, cancelling video selection.'
      )
    }

    const videoIndex = parseInt(response.first().content, 10)
    youtubeVideo = await youtube.getVideo(
      searchResults.results[videoIndex - 1].id
    )

    return handleVideo(youtubeVideo, msg, voiceChannel, this.client)
  }
}

export async function handleVideo(
  video: Video,
  msg: CommandMessage,
  voiceChannel: VoiceChannel,
  client: Client,
  playlist = false
) {
  const serverQueue = client.songQueues.get(msg.guild.id)

  if (!serverQueue) {
    const queueConstruct = new SongQueue(msg.guild.id, voiceChannel)
    client.songQueues.set(msg.guild.id, queueConstruct)
    queueConstruct.songs.push(video)

    const connection = await voiceChannel.join()
    queueConstruct.connection = connection

    play(msg.guild, queueConstruct.songs[0], client)
  } else {
    serverQueue.songs.push(video)

    if (playlist) {
      return msg.channel.send('')
    }
  }
  return msg.channel.send(`✅ **${video.title}** has been added to the queue!`)
}

function play(guild: Guild, song: Video, client: Client) {
  const serverQueue = client.songQueues.get(guild.id)!

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason) {
        console.error(reason)
      }

      setTimeout(() => {
        serverQueue.songs.shift()
        play(guild, serverQueue.songs[0], client)
      }, 1000)
    })
    .on('error', error => console.error(error))

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
}
