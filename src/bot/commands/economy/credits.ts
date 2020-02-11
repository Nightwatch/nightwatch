import { UserService } from '../../services'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class CreditsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'credits',
      group: 'economy',
      aliases: ['balance', 'bal'],
      description: 'Check how many credits you or someone else has.',
      guildOnly: false,
      args: [
        {
          key: 'user',
          phrase: 'Whose credits would you like to view?\n',
          type: 'user',
          optional: true
        }
      ]
    })
  }

  public async run(msg: Message, args: any) {
    const userService = new UserService()
    const userId = args.user ? args.user.id : msg.author.id
    const userName = args.user ? args.user.displayName : msg.author.username

    const user = await userService
      .find(userId)
      .catch(_ => userService.create(args.user))
      .catch(() => {
        // swallow
      })

    const credits = user ? user.balance.balance : 0
    const dollarEmoji = '💵'

    return msg.channel.send(
      `${userName} has ${dollarEmoji} ${credits} credits.`
    )
  }
}
