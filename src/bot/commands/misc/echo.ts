import { Command } from '../../base'
import { Message, Client } from 'bot-ts'

export default class EchoCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'echo',
      group: 'misc',
      description: 'Make me repeat what you said.',
      guildOnly: false,
      args: [
        {
          key: 'phrase',
          phrase: 'What would you like me to echo?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: Message, args: any) {
    if (!args.phrase || !args.phrase.trim()) {
      return msg.reply(
        'I cannot echo an empty string. Well I could, but that would be boring.'
      )
    }

    return msg.reply(args.phrase)
  }
}
