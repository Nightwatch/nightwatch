import { Command } from '../../base'
import { Client } from '../../models'
import { CommandMessage } from 'discord.js-commando'

export default class NowPlayingCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'np',
      group: 'music',
      memberName: 'np',
      description: 'Displays the currently playing song.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    const nowPlaying = this.client.musicPlayer.nowPlaying

    if (!nowPlaying) {
      return msg.reply('Nothing is currently playing.')
    }

    if (this.client.musicPlayer.isPlaying()) {
      const embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Now Playing: ' + nowPlaying.title,
          icon_url:
            'https://img.youtube.com/vi/' + nowPlaying.id + '/hqdefault.jpg'
        },
        thumbnail: {
          url: 'https://img.youtube.com/vi/' + nowPlaying.id + '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value:
              '[Click Here](' +
              'https://www.youtube.com/watch?v=' +
              nowPlaying.id +
              ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: nowPlaying.user,
            inline: true
          }
        ],
        footer: {
          text: 'Nightwatch'
        }
      }

      if (this.client.musicPlayer.queue.length > 0) {
        embed.fields.push({
          name: 'Up Next',
          value: this.client.musicPlayer.queue[0].title,
          inline: false
        })
      }

      return msg.reply({ embed })
    }

    const response = 'Nothing is currently playing.'

    return msg.reply(response)
  }
}
