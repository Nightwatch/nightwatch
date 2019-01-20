import { Message } from 'discord.js'
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando'

export default class WarnCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      memberName: 'ban',
      description: 'Bans user.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I ban?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'Why should I ban them?\n',
          type: 'string'
        }
      ]
    })
  }

  public hasPermission (msg: CommandMessage): boolean {
    return (
      this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS')
    )
  }

  public async run (msg: CommandMessage): Promise<Message | Message[]> {
    const args = msg.argString.trim()
    const member = msg.mentions.members.first()!
    const reason = args.substring(member.nickname.length)

    if (msg.author.id === member.id) {
      return msg.reply("You can't ban yourself.")
    }

    if (member.hasPermission('BAN_MEMBERS') || msg.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return msg.reply("You can't ban that member.")
    }

    await member.ban({ reason: reason })
    const dm = await member.createDM()
    await dm.send(`You have been banned from ${msg.guild.name} for: ${reason}`)
    return msg.channel.send(`${member.nickname} has been banned!`)
  }
}
