import { Config } from '../../../common'
const config: Config = require('../../../../config/config.json')
import { Command } from '../../base'
import { Client, Message, MessageEmbed } from 'bot-ts'

export default class DonateCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'donate',
      group: 'misc',
      description: "See how you can support the bot's development.",
      guildOnly: false
    })
  }

  public async run(msg: Message) {
    const url = 'https://patreon.com/ihaxjoker'

    const embed = new MessageEmbed(this.client)
      .setTitle('Support Nightwatch')
      .setURL(url)
      .setColor('BLUE')
      .setDescription(
        // tslint:disable-next-line: max-line-length
        `Donating helps support my development and pays for my hosting.\nIf you would like to donate, please visit ${url}`
      )
      .setFooter(config.bot.botName)
      .setTimestamp(new Date())

    return msg.channel.send(embed)
  }
}
