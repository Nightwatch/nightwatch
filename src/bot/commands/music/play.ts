import { CommandMessage } from 'discord.js-commando'
import { Config } from '../../../common'
import { Command } from '../../base'
import { Client } from '../../models'
import { isUri } from 'valid-url'
import { TextChannel } from 'discord.js'
import { YouTube } from 'popyt'

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
          default: ''
        }
      ],
      hidden:
        !config.optional.googleApiKey || !config.optional.googleApiKey.trim()
    })
  }

  public async run(msg: CommandMessage, args: { search: string }) {
    if (!args.search.trim()) {
      return msg.reply('Song url or name must be provided.')
    }

    const voiceChannel = msg.member.voiceChannel

    if (!voiceChannel) {
      return msg.reply('You must be in a voice channel to play music.')
    }

    this.client.musicPlayer.stopped = false
    this.client.musicPlayer.voiceChannel = voiceChannel
    this.client.musicPlayer.textChannel = msg.channel as TextChannel

    if (isUri(args.search)) {
      const regExp = /^.*(youtu.be\/|list=)([^#&?]*).*/
      const match = args.search.match(regExp)

      if (match && match[2]) {
        return msg.reply('Playlists are currently not supported.')
      }
      return this.client.musicPlayer.addToQueue(args.search, msg.message)
    }

    const search = await youtube.searchVideos(args.search, 1)

    if (!search || !search.results) {
      return msg.reply('No results found.')
    }

    return this.client.musicPlayer.addToQueue(
      search.results[0].url,
      msg.message
    )
  }
}
