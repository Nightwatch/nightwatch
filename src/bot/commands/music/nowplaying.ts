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
    if (!this.client.musicPlayer.nowPlaying) {
      return msg.reply('Nothing is currently playing.')
    }

    if (this.client.musicPlayer.isPlaying()) {
      const embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Now Playing: ' + this.client.musicPlayer.nowPlaying.title,
          icon_url:
            'https://img.youtube.com/vi/' +
            this.client.musicPlayer.nowPlaying.id +
            '/hqdefault.jpg'
        },
        thumbnail: {
          url:
            'https://img.youtube.com/vi/' +
            this.client.musicPlayer.nowPlaying.id +
            '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value:
              '[Click Here](' +
              'https://www.youtube.com/watch?v=' +
              this.client.musicPlayer.nowPlaying.id +
              ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: this.client.musicPlayer.nowPlaying.user,
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
