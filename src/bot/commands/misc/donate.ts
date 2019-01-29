import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'

export default class DonateCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'donate',
      group: 'misc',
      memberName: 'donate',
      description: 'See how you can support the bot\'s development.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const embed = new MessageEmbed()
      .setTitle('Support Nightwatch')
      .setURL('https://patreon.com/ihaxjoker')
      .setTimestamp(new Date())

    return msg.channel.send(embed)
  }
}
