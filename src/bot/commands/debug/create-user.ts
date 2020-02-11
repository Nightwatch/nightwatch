import { GuildMember } from 'discord.js'
import { UserService } from '../../services'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

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
          phrase: 'Who should I add to my database?\n',
          type: 'member'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.create(member.user)

    return msg.reply('Created user.')
  }
}
