import { GuildService } from '../../services'
import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class CreateGuildCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'createguild',
      group: 'debug',
      description: 'Force create a guild.',
      guildOnly: false,
      args: [
        {
          key: 'guildId',
          phrase: 'What is the ID of the guild?\n',
          type: 'string'
        }
      ],
      ownerOnly: true
    })
  }

  public async run(msg: Message, args: any) {
    const guildService = new GuildService()

    const guild = args.guildId
      ? this.client.guilds.find(x => x.id === args.id)
      : msg.guild

    if (!guild) {
      return msg.reply('Guild not found')
    }

    await guildService.create(guild)

    return msg.reply('Created guild.')
  }
}
