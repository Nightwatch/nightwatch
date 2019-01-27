import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import * as simplegit from 'simple-git/promise'

export default class UpdateCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'update',
      group: 'debug',
      memberName: 'update',
      description: 'Updates the bot if a new update exists.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const git = simplegit()

    await git.checkout('.')

    const result = await git.pull()

    if (!result || result.summary.changes === 0) {
      return msg.reply('I am already up to date.')
    }

    await msg.channel.send('I have evolved! I will restart now.')

    return process.exit(1)
  }
}
