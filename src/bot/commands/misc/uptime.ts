import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { describe } from 'pm2'

export default class UptimeCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'uptime',
      group: 'misc',
      memberName: 'uptime',
      description: 'See how long I\'ve been up since my last restart.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
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

        const embed = new MessageEmbed()

        embed
          .setAuthor('Uptime')
          .setColor('BLUE')
          .addField('Bot', botUptime, true)
          .addField('API', apiUptime, true)
          .setTimestamp(new Date())

        return msg.channel.send(embed)
      })
    })

    return msg.channel.send(null)
  }
}
