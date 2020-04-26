import { Command } from '../../base'
import { CommandMessage } from 'discord.js-commando'
import { Client } from '../../models'

export default class QueueCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'View the songs in the queue.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandMessage) {
    if (this.client.musicPlayer.isQueueEmpty()) {
      return msg.reply('The queue is empty.')
    }

    let response = '```'
    const isQueueLong = this.client.musicPlayer.queue.length > 30
    for (
      let i = 0;
      i < (isQueueLong ? 30 : this.client.musicPlayer.queue.length);
      i++
    ) {
      response +=
        '"' +
        this.client.musicPlayer.queue[i].title +
        '" (requested by ' +
        this.client.musicPlayer.queue[i].user +
        ')\n'
    }

    if (isQueueLong) {
      response +=
        '\n**...and ' + (this.client.musicPlayer.queue.length - 30) + ' more.**'
    }

    response += '```'

    return msg.reply(response)
  }
}
