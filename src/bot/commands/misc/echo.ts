import { Message } from 'discord.js'
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando'

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
      }
    })
  }

  public async run (msg: CommandMessage): Promise<Message | Message[]> {
    if (!msg.argString || !msg.argString.trim()) {
      return msg.reply(
        'I cannot echo an empty string. Well I could, but that would be boring.'
      )
    }

    return msg.reply(msg.argString)
  }
}
