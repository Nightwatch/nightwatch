import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class RngCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'rng',
      group: 'games',
      memberName: 'rng',
      description: 'Generate a random positive integer.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'max',
          prompt: 'What is the highest number to generate?\n',
          type: 'integer'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: {max: number}) {
    if (args.max < 1) {
      return msg.reply(
        'The max must be greater than 0.'
      )
    }

    return msg.reply(Math.floor(Math.random() * args.max))
  }
}
