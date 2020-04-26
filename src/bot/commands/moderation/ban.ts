import { CommandMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class BanCommand extends Command {
  constructor(client: Client) {
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

  public hasPermission(msg: CommandMessage): boolean {
    return (
      this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS')
    )
  }

  public async run(msg: CommandMessage, args: any) {
    if (msg.author.id === args.member.id) {
      return msg.reply("You can't ban yourself.")
    }

    if (
      args.member.hasPermission('BAN_MEMBERS') ||
      msg.member.highestRole.comparePositionTo(args.member.roles.highest) <= 0
    ) {
      return msg.reply("You can't ban that member.")
    }

    await args.member.ban({ reason: args.reason })
    const dm = await args.member.createDM()
    await dm.send(
      `You have been banned from ${msg.guild.name} for: ${args.reason}`
    )
    return msg.channel.send(`${args.member.nickname} has been banned!`)
  }
}
