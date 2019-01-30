import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { describe } from 'pm2'
import * as Bluebird from 'bluebird'
import * as prettyMs from 'pretty-ms'

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
    const asyncDescribe = Bluebird.promisify(describe)

    const api = await asyncDescribe('api')
    const bot = await asyncDescribe('bot')

    const apiUptime = api[0].pm2_env!.pm_uptime || 0
    const botUptime = bot[0].pm2_env!.pm_uptime || 0

    const embed = new MessageEmbed()

    embed
      .setAuthor('Uptime')
      .setColor('BLUE')
      .addField('Bot', prettyMs(botUptime), true)
      .addField('API', prettyMs(apiUptime), true)
      .setTimestamp(new Date())

    return msg.channel.send(embed)
  }
}
