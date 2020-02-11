import { GuildMember } from 'discord.js'
import { UserService } from '../../services'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class DeleteUserCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'deleteuser',
      group: 'debug',
      description: 'Force delete a user.',
      guildOnly: false,
      args: [
        {
          key: 'member',
          phrase: 'Who should I delete?\n',
          type: 'user'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const userService = new UserService()

    const member = args.member as GuildMember
    await userService.delete(member.id)

    return msg.reply('Deleted user.')
  }
}
