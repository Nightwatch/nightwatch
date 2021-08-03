import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'
import { GuildService } from '../../services'

export default class EchoCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'setwelcome',
      group: 'misc',
      memberName: 'setwelcome',
      description: 'Set a custom welcome message that I will DM users when they join.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'message',
          prompt: 'What would you like the welcome message to say?\n',
          type: 'string'
        }
      ]
    })
  }

  public hasPermission(msg: CommandoMessage): boolean {
    return (
      this.client.isOwner(msg.author) || !!msg.member?.hasPermission('MANAGE_GUILD')
    )
  }

  public async run(msg: CommandoMessage, args: {message: string}) {
    if (!args.message || !args.message.trim()) {
      return msg.reply(
        'The welcome message must not be empty.'
      )
    }

    try {
      const guildService = new GuildService()

      guildService.updateWelcomeMessage(msg.guild.id, args.message)

      return msg.reply(`The welcome message has been updated!`)
    } catch {
      return msg.reply('I was unable to update the welcome message. Try again.')
    }
  }
}
