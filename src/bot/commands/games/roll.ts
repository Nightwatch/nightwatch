import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class RollCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'roll',
      group: 'games',
      description: 'Roll some die.',
      guildOnly: false,
      args: [
        {
          key: 'numberOfSides',
          phrase: 'How many sides does each dice have?\n',
          type: 'number',
          default: 6
        },
        {
          key: 'numberOfDie',
          phrase: 'How many die should I roll?\n',
          type: 'number',
          default: 1
        },
        {
          key: 'repeat',
          phrase: 'How many times should I roll them?\n',
          type: 'number',
          default: 1
        }
      ]
    })
  }

  public async run(msg: Message, args: any) {
    const numberOfDie = args.numberOfDie as number
    const numberOfSides = args.numberOfSides as number
    const repeat = args.repeat as number

    const roll = () => Math.floor(Math.random() * numberOfSides) + 1

    let result = "Here's what I rolled:\n\n"

    for (let i = 0; i < repeat; i++) {
      for (let j = 0; j < numberOfDie; j++) {
        result += roll() + ' '
      }
      result += '\n'
    }

    return msg.channel.send(result)
  }
}
