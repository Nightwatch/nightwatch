import { GuildMember } from 'discord.js'
import { Command } from '../../base'
import { UserController } from '../../controllers'
import { Client, Message } from 'bot-ts'

export default class CheckPremiumCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'checkpremium',
      group: 'debug',
      description: 'See if a user has premium.',
      guildOnly: false,
      args: [
        {
          key: 'user',
          phrase: 'Who should I check?\n',
          type: 'user'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const userController = new UserController()

    const user = args.user as GuildMember

    const hasPremium = userController.userHasPremium(user.id, this.client)

    return msg.channel.send(
      `**${user.displayName}** ${hasPremium ? 'has' : 'does not have'} premium.`
    )
  }
}
