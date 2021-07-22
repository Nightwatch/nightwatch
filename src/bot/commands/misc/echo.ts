import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class EchoCommand extends Command {
  constructor(client: Client) {
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

  public async run(msg: CommandoMessage, args: any) {
    if (!args.phrase || !args.phrase.trim()) {
      return msg.reply(
        'I cannot echo an empty string. Well I could, but that would be boring.'
      )
    }

    return msg.reply(args.phrase)
  }
}
