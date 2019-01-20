import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'

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

  public hasPermission (msg: CommandoMessage): boolean {
    return (
      this.client.isOwner(msg.author) ||
      msg.member.hasPermission('KICK_MEMBERS')
    )
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const args = msg.argString.trim()
    const member = msg.mentions.members.first()!
    const reason = args.substring(member.nickname.length)

    if (msg.author.id === member.id) {
      return msg.reply("You can't kick yourself.")
    }

    if (member.hasPermission('KICK_MEMBERS') || msg.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return msg.reply("You can't kick that member.")
    }

    await member.kick(reason)

    return msg.channel.send(`${member.user} has been kicked.`)
  }
}
