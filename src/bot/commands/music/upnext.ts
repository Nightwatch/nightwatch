import { Command } from '../../base'
import { Client } from '../../models'
import { CommandMessage } from 'discord.js-commando'

export default class UpNextCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'upnext',
      group: 'music',
      memberName: 'upnext',
      description: 'Displays the next playing song.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (this.client.musicPlayer.queue.length > 0) {
      const embed = {
        title: ' ',
        color: 0x2196f3,
        author: {
          name: 'Up Next: ' + this.client.musicPlayer.queue[0].title,
          icon_url:
            'https://img.youtube.com/vi/' +
            this.client.musicPlayer.queue[0].id +
            '/hqdefault.jpg'
        },
        thumbnail: {
          url:
            'https://img.youtube.com/vi/' +
            this.client.musicPlayer.queue[0].id +
            '/hqdefault.jpg'
        },
        fields: [
          {
            name: 'Link',
            value:
              '[Click Here](' +
              'https://www.youtube.com/watch?v=' +
              this.client.musicPlayer.queue[0].id +
              ')',
            inline: true
          },
          {
            name: 'Requested By',
            value: this.client.musicPlayer.queue[0].user,
            inline: true
          }
        ],
        footer: {
          text: 'Nightwatch'
        }
      }

      return msg.reply({ embed })
    }

    const response = 'Nothing has been requested.'

    return msg.reply(response)
  }
}
