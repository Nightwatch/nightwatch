import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class ResumeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'resume',
      group: 'music',
      memberName: 'resume',
      description: 'Resumes the playlist.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (!this.client.musicPlayer.stopped) {
      return msg.reply('Playback is already running.')
    }

    return this.client.musicPlayer.playNextSong()
  }
}
