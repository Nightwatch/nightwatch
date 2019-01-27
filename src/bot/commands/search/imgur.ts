import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import axios from 'axios'
import { Config } from '../../../common'
import { Message, MessageAttachment, TextChannel } from 'discord.js'
const config: Config = require('../../../../config/config.json')

export default class ImgurCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'imgur',
      group: 'search',
      memberName: 'imgur',
      description: 'Searches Imgur for an image.',
      args: [
        {
          key: 'query',
          prompt: 'What image would you like to search for?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    if (!config.optional || !config.optional.imgur) {
      return msg.reply('Command failed. Bot owner has not configured the bot with an Imgur API key.')
    }

    const query = args.query as string

    interface Album {
      nsfw: boolean
      images: Image[]
    }

    interface Image {
      link: string
    }

    const { data: albums }: {data: Album[]} = await axios.get(`https://api.imgur.com/3/gallery/search?q=${encodeURI(query)}`, {
      headers: {
        'Authorization': `Client-ID ${config.optional.imgur.clientId}`
      }
    })

    const filteredAlbums = albums.filter(album => album && ((msg.channel as TextChannel).nsfw ? true : !album.nsfw))

    if (!filteredAlbums.length) {
      return msg.reply('No results found.')
    }

    return msg.channel.send(new MessageAttachment(filteredAlbums[Math.floor(Math.random() * filteredAlbums.length)].images[0].link))
  }
}
