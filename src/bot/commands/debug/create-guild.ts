import { CommandoMessage } from 'discord.js-commando'
import { GuildService } from '../../services'
import { Command } from '../../base'
import { Client } from '../../models'

export default class CreateGuildCommand extends Command {
  constructor(client: Client) {
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

  public async run(msg: CommandoMessage, args: any) {
    const guildService = new GuildService()

    const guild = args.guildId
      ? this.client.guilds.resolve(args.id)
      : msg.guild

    if (!guild) {
      return msg.reply('Guild not found')
    }

    await guildService.create(guild)

    return msg.reply('Created guild.')
  }
}
