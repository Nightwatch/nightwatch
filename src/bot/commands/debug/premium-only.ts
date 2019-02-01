import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class PremiumOnlyCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'premiumonly',
      group: 'debug',
      memberName: 'premiumonly',
      description: 'Test that the bot will deny you from using a premium command if you don\'t have premium access.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: false // Intentional, so it can be tested.
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    return msg.channel.send('This message should not appear.')
  }
}
