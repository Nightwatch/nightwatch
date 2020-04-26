import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class VolumeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'volume',
      group: 'music',
      memberName: 'volume',
      description: 'Change or see the music volume level.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'modifier',
          oneOf: ['up', 'down', ''],
          default: '',
          type: 'string',
          prompt: 'Should the volume go up or down?\n'
        }
      ]
    })
  }

  public async run(
    msg: CommandMessage,
    args: { modifier: 'up' | 'down' | '' }
  ) {
    if (!args.modifier) {
      return msg.reply(
        `The current volume level is ${this.client.musicPlayer.getVolume() *
          10}%`
      )
    }

    if (args.modifier === 'up') {
      this.client.musicPlayer.incrementVolume()
    } else {
      this.client.musicPlayer.decrementVolume()
    }

    return msg.reply(
      `The current volume level is now ${this.client.musicPlayer.getVolume() *
        10}%`
    )
  }
}
