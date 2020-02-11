import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class KickCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      description: 'Kicks user from guild.',
      guildOnly: true,
      args: [
        {
          key: 'member',
          phrase: 'Who should I kick?\n',
          type: 'user'
        },
        {
          key: 'reason',
          phrase: 'Why should I kick them?\n',
          type: 'string'
        }
      ]
    })
  }

  public async hasPermission(msg: Message) {
    return (
      this.client.options.ownerId === msg.author.id ||
      msg.member.hasPermission('KICK_MEMBERS')
    )
  }

  public async run(msg: Message, args: any) {
    if (msg.author.id === args.member.id) {
      return msg.reply("You can't kick yourself.")
    }

    if (
      args.member.hasPermission('KICK_MEMBERS') ||
      msg.member.highestRole.comparePositionTo(args.member.roles.highest) <= 0
    ) {
      return msg.reply("You can't kick that member.")
    }

    await args.member.kick(args.reason)

    return msg.channel.send(`${args.member.user} has been kicked.`)
  }
}
