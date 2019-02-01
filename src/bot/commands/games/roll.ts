import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class RollCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'roll',
      group: 'games',
      memberName: 'roll',
      description: 'Roll some die.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'numberOfSides',
          prompt: 'How many sides does each dice have?\n',
          type: 'integer',
          default: 6,
          max: 100
        },
        {
          key: 'numberOfDie',
          prompt: 'How many die should I roll?\n',
          type: 'integer',
          default: 1,
          max: 10
        },
        {
          key: 'repeat',
          prompt: 'How many times should I roll them?\n',
          type: 'integer',
          default: 1,
          max: 10
        }
      ]
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    const numberOfDie = args.numberOfDie as number
    const numberOfSides = args.numberOfSides as number
    const repeat = args.repeat as number

    const roll = () => Math.floor(Math.random() * numberOfSides) + 1

    let result = 'Here\'s what I rolled:\n\n'

    for (let i = 0; i < repeat; i++) {
      for (let j = 0; j < numberOfDie; j++) {
        result += roll() + ' '
      }
      result += '\n'
    }

    return msg.channel.send(result)
  }
}
