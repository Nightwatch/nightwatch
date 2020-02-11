import { Command } from '../../base'
import { Message, Client } from 'bot-ts'

export default class RestartCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'restart',
      group: 'debug',
      description: 'Restarts the bot.',
      guildOnly: false,
      ownerOnly: true
    })
  }

  public async run(msg: Message) {
    await msg.channel.send('Restarting...')

    return process.exit(1)
  }
}
