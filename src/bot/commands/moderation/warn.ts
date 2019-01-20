import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'

export default class WarnCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'warn',
      group: 'moderation',
      memberName: 'warn',
      description: 'Warns user.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I warn?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'Why should I warn them?\n',
          type: 'string'
        }
      ]
    })
  }

  public hasPermission (msg: CommandoMessage): boolean {
    return (
      this.client.isOwner(msg.author) ||
      msg.member.hasPermission('MANAGE_MESSAGES')
    )
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const args = msg.argString.trim()
    const member = msg.mentions.members.first()!
    const reason = args.substring(member.nickname.length)

    if (msg.author.id === member.id) {
      return msg.reply("You can't warn yourself.")
    }

    if (member.hasPermission('MANAGE_MESSAGES') || msg.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return msg.reply("You can't warn that member.")
    }

    const dm = await member.createDM()
    await dm.send(`You have received a warning from ${msg.guild.name} for: ${reason}`)
    return msg.channel.send(`${member.user} has been warned.`)
  }
}
