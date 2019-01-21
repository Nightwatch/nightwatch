import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserService } from '../../services'

export default class BioCommand extends Command {
  constructor (client: CommandoClient) {
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

  public async run (
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
    const userService = new UserService()

    const user = await userService.find(msg.author.id)

    if (!user) {
      msg.reply('Command failed. I was unable to find you in my database.')
    }

    user.profile.bio = args.description

    await userService.updateProfile(msg.autor.id, user.profile)

    return msg.reply('Bio updated!')
  }
}
