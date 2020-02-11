import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class LMGTFYCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'lmgtfy',
      group: 'misc',
      description: 'Let me Google that for you.',
      guildOnly: false,
      args: [
        {
          key: 'search',
          type: 'string',
          phrase: 'What would you like to know?\n'
        }
      ]
    })
  }

  public async run(msg: Message, args: any) {
    return msg.reply(`https://lmgtfy.com/?q=${encodeURIComponent(args.search)}`)
  }
}
