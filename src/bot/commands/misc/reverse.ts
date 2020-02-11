import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class ReverseCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'reverse',
      group: 'misc',
      description: 'Make me repeat what you said, reversed.',
      guildOnly: false,
      args: [
        {
          key: 'phrase',
          phrase: 'What would you like me to reverse?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: Message, args: any) {
    if (!args.phrase || !args.phrase.trim()) {
      return msg.reply(
        'I cannot reverse an empty string. Well I could, but that would be boring.'
      )
    }

    const phrase = args.phrase as string

    return msg.reply(
      phrase
        .split('')
        .reverse()
        .join('')
    )
  }
}
