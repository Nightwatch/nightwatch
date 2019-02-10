import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class LMGTFYCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'lmgtfy',
      group: 'misc',
      memberName: 'lmgtfy',
      description: 'Let me Google that for you.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'search',
          type: 'string',
          prompt: 'What would you like to know?\n'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    return msg.reply(`https://lmgtfy.com/?q=${encodeURIComponent(args.search)}`)
  }
}
