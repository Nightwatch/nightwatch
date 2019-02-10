import { Message, MessageEmbed } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Config } from '../../../common'
const config: Config = require('../../../../config/config.json')
import { Command } from '../../base'

export default class DonateCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'donate',
      group: 'misc',
      memberName: 'donate',
      description: "See how you can support the bot's development.",
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(
    msg: CommandoMessage
  ): Promise<Message | ReadonlyArray<Message>> {
    const url = 'https://patreon.com/ihaxjoker'

    const embed = new MessageEmbed()
      .setTitle('Support Nightwatch')
      .setURL(url)
      .setColor('BLUE')
      .setDescription(
        `Donating helps support my development and pays for my hosting.\nIf you would like to donate, please visit ${url}`
      )
      .setFooter(config.bot.botName)
      .setTimestamp(new Date())

    return msg.channel.send(embed)
  }
}
