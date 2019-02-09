import { Message, MessageEmbed } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { describe } from 'pm2'
import * as prettyMs from 'pretty-ms'
import { Command } from '../../base'

export default class UptimeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'uptime',
      group: 'misc',
      memberName: 'uptime',
      description: "See how long I've been up since my last restart.",
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandoMessage): Promise<Message | Message[]> {
    describe('api', (err, apiDescriptions) => {
      if (err) {
        return msg.reply('Command failed. An error occurred.')
      }

      const apiUptime = apiDescriptions[0].pm2_env!.pm_uptime || 0

      return describe('bot', (err, botDescriptions) => {
        if (err) {
          return msg.reply('Command failed. An error occurred.')
        }

        const botUptime = botDescriptions[0].pm2_env!.pm_uptime || 0
        const currentTime = Date.now()

        const embed = new MessageEmbed()

        embed
          .setAuthor('Uptime')
          .setColor('BLUE')
          .addField('Bot', prettyMs(currentTime - botUptime), true)
          .addField('API', prettyMs(currentTime - apiUptime), true)
          .setTimestamp(new Date())

        return msg.channel.send(embed)
      })
    })

    return msg.channel.send(
      'I am updated frequently, so my uptime is probably low!'
    )
  }
}
