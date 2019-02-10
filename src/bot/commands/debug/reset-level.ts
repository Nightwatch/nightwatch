import { GuildMember } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserService } from '../../services'
import { UserLevelBalance } from '../../../api/src/models'
import { Command } from '../../base'

export default class ResetLevelCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'resetlevel',
      group: 'debug',
      memberName: 'resetlevel',
      description: "Force reset a user's level.",
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: "Who's level should I reset?\n",
          type: 'member'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.updateLevelBalance(member.id, {
      level: { xp: 0, level: 0 }
    } as UserLevelBalance)

    return msg.reply('Successfully reset user level.')
  }
}
