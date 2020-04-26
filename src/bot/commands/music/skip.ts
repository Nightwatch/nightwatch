import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class SkipCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'skip',
      group: 'music',
      memberName: 'skip',
      description: 'Skips the current song.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (!this.client.musicPlayer.voiceHandler) {
      return msg.reply('There is nothing being played.')
    }

    this.client.musicPlayer.voiceHandler.end()
    this.client.musicPlayer.voiceHandler = undefined

    return msg.reply('Skipping...')
  }
}
