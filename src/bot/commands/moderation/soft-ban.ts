import { GuildMember } from 'discord.js'
import { CommandMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class SoftBanCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'softban',
      group: 'moderation',
      memberName: 'softban',
      description:
        'Soft bans user (bans and immediately unbans them to delete their messages).',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I softban?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'Why should I softban them?\n',
          type: 'string'
        }
      ]
    })
  }

  public hasPermission(msg: CommandMessage): boolean {
    return (
      this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS')
    )
  }

  public async run(msg: CommandMessage, args: any) {
    const member = args.member as GuildMember

    if (msg.author.id === member.id) {
      return msg.reply("You can'tsoft ban yourself.")
    }

    if (
      member.hasPermission('BAN_MEMBERS') ||
      msg.member.highestRole.comparePositionTo(member.highestRole) <= 0
    ) {
      return msg.reply("You can't softban that member.")
    }

    await member.ban({ reason: args.reason, days: 7 })

    await (msg.guild as any).unban(member.id)

    const dm = await args.member.createDM()
    await dm.send(
      `You have been softbanned from ${msg.guild.name} for \`${args.reason}\`\n\nYou can rejoin immediately.`
    )

    return msg.channel.send(`${args.member.nickname} has been softbanned!`)
  }
}
