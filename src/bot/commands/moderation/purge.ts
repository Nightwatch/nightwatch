import { Message, TextChannel } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class PurgeCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'purge',
      group: 'moderation',
      memberName: 'purge',
      description:
        'Deletes messages from a channel. (Messages must be less than 14 days old)',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'amount',
          prompt: 'How many messages should I delete?\n',
          type: 'integer',
          max: 100,
          min: 2
        }
      ]
    })
  }

  public hasPermission(msg: CommandoMessage): boolean {
    return (
      this.client.isOwner(msg.author) ||
      msg.member.hasPermission('MANAGE_MESSAGES')
    )
  }

  public async run(
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
    const amount = args.amount as number

    const textChannel = msg.channel as TextChannel

    await textChannel.bulkDelete(amount)

    return msg.reply('Purge complete.')
  }
}
