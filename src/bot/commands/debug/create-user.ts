import { Message, GuildMember } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserService } from '../../services'

export default class CreateUserCommand extends Command {
  constructor (client: CommandoClient) {
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

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.create(member.user)

    return msg.reply('Created user.')
  }
}
