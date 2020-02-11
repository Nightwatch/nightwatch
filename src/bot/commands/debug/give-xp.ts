import { GuildMember } from 'discord.js'
import { UserService } from '../../services'
import { UserLevelBalance } from '../../../api/src/models'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class GiveXpCommand extends Command {
  public readonly premiumOnly: true

  constructor(client: Client) {
    super(client, {
      name: 'givexp',
      group: 'debug',
      description: 'Give a user xp.',
      guildOnly: false,
      args: [
        {
          key: 'member',
          phrase: 'Who should I give xp to?\n',
          type: 'user'
        },
        {
          key: 'amount',
          phrase: 'How much xp should I give?\n',
          type: 'number'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    const amount = args.amount as number

    const user = await userService.find(member.id)

    if (!user) {
      return msg.reply('Unable to find that user in my database.')
    }

    user.level.xp += amount

    await userService.updateLevelBalance(member.id, {
      level: user.level
    } as UserLevelBalance)

    return msg.reply('Updated user xp.')
  }
}
