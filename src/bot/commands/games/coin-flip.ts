import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class DiceRollCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'flip',
      group: 'games',
      memberName: 'flip',
      description: 'Flip a coin.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
    })
  }

  public async run(msg: CommandoMessage) {
    return msg.reply(Math.floor(Math.random() * 10) % 2 == 0 ? 'Heads!' : 'Tails!')
  }
}
