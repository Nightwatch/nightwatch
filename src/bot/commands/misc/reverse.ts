import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class ReverseCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'reverse',
      group: 'misc',
      memberName: 'reverse',
      description: 'Make me repeat what you said, reversed.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'phrase',
          prompt: 'What would you like me to reverse?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    if (!args.phrase || !args.phrase.trim()) {
      return msg.reply(
        'I cannot reverse an empty string. Well I could, but that would be boring.'
      )
    }

    const phrase = args.phrase as string

    return msg.reply(phrase.split('').reverse().join(''))
  }
}
