import { GuildMember } from 'discord.js'
import { CommandMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'
import { UserController } from '../../controllers'

export default class CheckPremiumCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'checkpremium',
      group: 'debug',
      memberName: 'checkpremium',
      description: 'See if a user has premium.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'user',
          prompt: 'Who should I check?\n',
          type: 'member'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: CommandMessage, args: any) {
    const userController = new UserController()

    const user = args.user as GuildMember

    const hasPremium = userController.userHasPremium(user.id, this.client)

    return msg.channel.send(
      `**${user.displayName}** ${hasPremium ? 'has' : 'does not have'} premium.`
    )
  }
}
