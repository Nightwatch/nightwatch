import { Message, GuildMember } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserService } from '../../services'
import { Command } from '../../base'

export default class DeleteUserCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'deleteuser',
      group: 'debug',
      memberName: 'deleteuser',
      description: 'Force delete a user.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I delete?\n',
          type: 'member'
        }
      ],
      ownerOnly: true
    })
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.delete(member.id)

    return msg.reply('Deleted user.')
  }
}
