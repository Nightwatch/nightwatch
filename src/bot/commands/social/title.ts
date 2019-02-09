import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserService } from '../../services/user'
import { Command } from '../../base'

export default class TitleCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'title',
      group: 'social',
      memberName: 'title',
      description: 'Update your profile title',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'description',
          prompt: 'What would you like it to say?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
    const userService = new UserService()

    const user = await userService.find(msg.author.id)

    if (!user) {
      return msg.reply(
        'Command failed. I was unable to find you in my database.'
      )
    }

    user.profile.title = args.description

    await userService.updateProfile(msg.author.id, user.profile)

    return msg.reply('Title updated!')
  }
}
