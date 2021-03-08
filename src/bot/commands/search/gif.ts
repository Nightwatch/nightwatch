import { RichEmbed } from 'discord.js'
import { CommandMessage } from 'discord.js-commando'
import axios from 'axios'
import { Config } from '../../../common'
import { Command } from '../../base'
import { Client } from '../../models'

const config: Config = require('../../../../config/config.json')

export default class GifCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'gif',
      group: 'search',
      memberName: 'gif',
      aliases: ['giphy'],
      description: 'Express yourself with a gif.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'search',
          prompt: 'What gif would you like to search for?\n',
          type: 'string'
        }
      ],
      hidden:
        !config.optional.giphyApiKey || !config.optional.giphyApiKey.trim()
    })
  }

  public async run(msg: CommandMessage, args: any) {
    if (!args.search.trim()) {
      return msg.reply('You must enter a search term or phrase.')
    }

    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=${
          config.optional.giphyApiKey
        }&tag=${encodeURIComponent(args.search)}`
      )

      if (!response.data.data.image_url) {
        return msg.channel.send('Nothing found!')
      }

      const embed = new RichEmbed()
        .setImage(`${response.data.data.image_url}`)
        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
        .setColor('#0066CC')

      return msg.channel.send({ embed })
    } catch {
      return msg.reply('An error occurred while searching for gifs.')
    }
  }
}
