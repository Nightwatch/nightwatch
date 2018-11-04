import { GuildMember, Message } from 'discord.js'
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando'

export default class KickCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks user from guild.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I kick?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'Why should I kick them?\n',
          type: 'string'
        }
      ]
    })
  }

  public hasPermission (msg: CommandMessage): boolean {
    return (
      this.client.isOwner(msg.author) ||
      msg.member.hasPermission('KICK_MEMBERS')
    )
  }

  public async run (
    msg: CommandMessage,
    args: { member: GuildMember; reason: string }
  ): Promise<Message | Message[]> {
    if (msg.author.id === args.member.id) {
      return msg.reply("You can't kick yourself.")
    }

    if (args.member.hasPermission('KICK_MEMBERS') || msg.member.roles.highest.comparePositionTo(args.member.roles.highest) <= 0) {
      return msg.reply("You can't kick that member.")
    }

    await args.member.kick(args.reason)

    return msg.channel.send(`${args.member.user} has been kicked.`)
  }
}
