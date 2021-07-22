import { GuildMember } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { UserService } from '../../services'
import { Command } from '../../base'
import { Client } from '../../models'

export default class CreateUserCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'createuser',
      group: 'debug',
      memberName: 'createuser',
      description: 'Force create a user.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I add to my database?\n',
          type: 'member'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.create(member.user)

    return msg.reply('Created user.')
  }
}
