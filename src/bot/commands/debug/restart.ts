import { CommandMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class RestartCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'restart',
      group: 'debug',
      memberName: 'restart',
      description: 'Restarts the bot.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true
    })
  }

  public async run(msg: CommandMessage) {
    await msg.channel.send('Restarting...')

    return process.exit(1)
  }
}
