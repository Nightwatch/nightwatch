import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'
import { GuildService } from '../../services'

export default class WarnCommand extends Command {
  constructor(client: Client) {
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

  public hasPermission(msg: CommandoMessage): boolean {
    return (
      this.client.isOwner(msg.author) ||
      !!msg.member?.hasPermission('MANAGE_MESSAGES')
    )
  }

  public async run(msg: CommandoMessage, args: any) {
    if (msg.author.id === args.member.id) {
      return msg.reply("You can't warn yourself.")
    }

    if (
      args.member.hasPermission('MANAGE_MESSAGES') ||
      (msg.member?.roles.highest && msg.member?.roles.highest.comparePositionTo(args.member.roles.highest) <= 0)
    ) {
      return msg.reply("You can't warn that member.")
    }

    const guildService = new GuildService()

    await guildService.createWarning(msg.guild.id, msg.member!.id, args.member.id, {reason: args.reason})

    const dm = await args.member.createDM()
    await dm.send(
      `You have received a warning from ${msg.guild.name} for: ${args.reason}`
    )
    return msg.channel.send(`${args.member.user} has been warned.`)
  }
}
