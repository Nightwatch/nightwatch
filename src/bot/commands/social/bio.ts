import { CommandoMessage } from 'discord.js-commando'
import { UserService } from '../../services'
import { Command } from '../../base'
import { Client } from '../../models'

export default class BioCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'bio',
      group: 'social',
      memberName: 'bio',
      description: 'Update your profile bio',
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

  public async run(msg: CommandoMessage, args: any) {
    const userService = new UserService()

    const user = await userService.find(msg.author.id)

    if (!user) {
      return msg.reply(
        'Command failed. I was unable to find you in my database.'
      )
    }

    user.profile.bio = args.description

    await userService.updateProfile(msg.author.id, user.profile)

    return msg.reply('Bio updated!')
  }
}
