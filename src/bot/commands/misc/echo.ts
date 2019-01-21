import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'

export default class EchoCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'echo',
      group: 'misc',
      memberName: 'echo',
      description: 'Make me repeat what you said.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'phrase',
          prompt: 'What would you like me to echo?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    if (!args.phrase || !args.phrase.trim()) {
      return msg.reply(
        'I cannot echo an empty string. Well I could, but that would be boring.'
      )
    }

    return msg.reply(args.phrase)
  }
}
