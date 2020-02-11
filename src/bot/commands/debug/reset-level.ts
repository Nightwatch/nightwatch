import { GuildMember } from 'discord.js'
import { UserService } from '../../services'
import { UserLevelBalance } from '../../../api/src/models'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class ResetLevelCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'resetlevel',
      group: 'debug',
      description: "Force reset a user's level.",
      guildOnly: false,
      args: [
        {
          key: 'member',
          phrase: "Who's level should I reset?\n",
          type: 'user'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.updateLevelBalance(member.id, {
      level: { xp: 0, level: 0 }
    } as UserLevelBalance)

    return msg.reply('Successfully reset user level.')
  }
}
