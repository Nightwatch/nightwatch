import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando'
import * as yargs from 'yargs'
import * as materialColors from 'material-colors'
import { oneLine } from 'common-tags'
import { Config } from '../../../common'
const config: Config = require('../../../../config/config.json')

export default class EmbedCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'embed',
      aliases: [],
      group: 'misc',
      memberName: 'embed',
      description: 'Creates a RichEmbed.',
      details: `Creates a RichEmbed. Here is a list of options:
      __--title:__ Sets the title of the embed.
      __--description:__ Sets the description of the embed.
      __--color:__ Sets the color of the embed.
      __--field:__ Adds a field to the embed.
      __--footer:__ Sets the footer text of the embed.
      __--channel:__ Sets the channel the embed will get sent to.`,
      guildOnly: true,
      args: [
        {
          key: 'message',
          prompt: 'What do you want the embed to say?',
          type: 'string'
        }
      ]
    })
  }

  public async run (msg: CommandMessage): Promise<Message | Message[]> {
    const message = msg.argString

    const argv = yargs
      .option('title', {
        type: 'array',
        default: [ '' ]
      })
      .option('description', {
        type: 'array',
        default: [ '' ]
      })
      .option('footer', {
        type: 'array',
        default: [ config.bot.botName ]
      })
      .option('color', {
        type: 'string',
        default: materialColors['red']['500']
      })
      .option('channel', {
        type: 'string',
        default: (msg.channel as TextChannel).name
      })
      .parse(message.split(' '))

    const title: string = argv.title ? argv.title.join(' ') : ''
    const description: string = argv.description
      ? argv.description.join(' ')
      : ''

    if (!title || !description) {
      return msg.replyEmbed(this.getHelpMessageEmbed())
    }

    const color = materialColors[argv.color || 'red']
      ? materialColors[argv.color || 'red']['500']
      : materialColors['red']['500'] as string
    const footer = argv.footer || null
    let channel = argv.channel
      ? msg.guild.channels.find(
          x =>
            x.name.toLowerCase() ===
              argv.channel.trim().toLowerCase().replace('#', '') &&
            x.type === 'text'
        )
      : msg.channel as TextChannel
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      channel = msg.channel as TextChannel
    }

    const embed = new MessageEmbed()

    embed
      .setThumbnail(msg.member.user.avatarURL({ format: 'png', size: 512 }))
      .setColor(color)
      .setDescription(description)
      .setFooter(footer || config.bot.botName)
      .setTimestamp(new Date())

    if (this.client.user) {
      embed
      .setAuthor(title || '', this.client.user.avatarURL({ format: 'png' }))
    }

    return (channel as TextChannel).send(embed)
  }

  private getHelpMessageEmbed () {
    const options = {
      title: {
        description: 'The title text, displays in bold at the top.'
      },
      description: {
        description: oneLine`The description of the embed.
            This serves as the body of the text, most text will go here.`
      },
      color: {
        description: 'The color of the embed.'
      },
      footer: {
        description: 'The footer text.'
      }
    }

    const embed = new MessageEmbed()
      .setColor(materialColors['blue']['500'])
      .setFooter(config.bot.botName)
      .setTimestamp(new Date())

    if (this.client.user) {
      embed
        .setAuthor(
          'Embed Help' || '',
          this.client.user.avatarURL({ format: 'png' })
        )
    }

    Object.entries(options).forEach(option => {
      embed.addField(`--${option[0]}`, option[1].description)
    })

    return embed
  }
}
