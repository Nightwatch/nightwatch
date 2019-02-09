import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { GuildService } from '../../services'
import { Command } from '../../base'

export default class CreateGuildCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'createguild',
      group: 'debug',
      memberName: 'createguild',
      description: 'Force create a guild.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'guildId',
          prompt: 'What is the ID of the guild?\n',
          type: 'string',
          default: ''
        }
      ],
      ownerOnly: true
    })
  }

  public async run(
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
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
