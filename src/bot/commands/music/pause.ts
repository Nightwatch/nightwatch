import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class PauseCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'pause',
      group: 'music',
      memberName: 'pause',
      description: 'Pauses the current song.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (this.client.musicPlayer.paused) {
      return msg.reply('Playback is already paused.')
    }

    this.client.musicPlayer.pause()

    return msg.reply('Pausing...')
  }
}
