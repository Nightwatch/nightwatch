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
          oneOf: ['up', 'down', '', ...range(11).map(x => x.toString())],
          default: '',
          type: 'string',
          prompt: 'What should the volume be? (0-10)\n'
        }
      ]
    })
  }

  public async run(
    msg: CommandMessage,
    // tslint:disable-next-line: max-union-size
    args: { modifier: 'up' | 'down' | '' | number }
  ) {
    if (!args.modifier) {
      return msg.reply(
        `The current volume level is ${this.client.musicPlayer.getVolume() *
          10}%`
      )
    }

    if (args.modifier === 'up') {
      this.client.musicPlayer.incrementVolume()
    } else if (args.modifier === 'down') {
      this.client.musicPlayer.decrementVolume()
    } else {
      this.client.musicPlayer.setVolume(args.modifier)
    }

    return msg.reply(
      `The current volume level is now ${this.client.musicPlayer.getVolume() *
        10}%`
    )
  }
}

function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt)
}
