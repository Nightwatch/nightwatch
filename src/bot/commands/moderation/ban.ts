import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class BanCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      description: 'Bans user.',
      guildOnly: true,
      args: [
        {
          key: 'member',
          phrase: 'Who should I ban?\n',
          type: 'user'
        },
        {
          key: 'reason',
          phrase: 'Why should I ban them?\n',
          type: 'string'
        }
      ]
    })
  }

  public async hasPermission(msg: Message) {
    return (
      this.client.options.ownerId === msg.author.id ||
      msg.member.hasPermission('BAN_MEMBERS')
    )
  }

  public async run(msg: Message, args: any) {
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
