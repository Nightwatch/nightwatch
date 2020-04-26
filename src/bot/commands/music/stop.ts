import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class StopCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'stop',
      group: 'music',
      memberName: 'stop',
      description: 'Stops the playlist.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (this.client.musicPlayer.stopped) {
      return msg.reply('Playback is already stopped.')
    }

    this.client.musicPlayer.stop()

    return msg.reply('Stopping...')
  }
}
