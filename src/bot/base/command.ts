import { UserController } from '../controllers'
import { CommandInfo } from '../../common'
import { Command as BotCommand, Client, Message } from 'bot-ts'

const userController = new UserController()

export abstract class Command extends BotCommand {
  public readonly premiumOnly: boolean

  constructor(client: Client, info: CommandInfo) {
    super(client, info)
    this.premiumOnly = info.premiumOnly || false
  }

  public async hasPermission(msg: Message) {
    if (!this.premiumOnly || this.client.isOwner(msg.author)) {
      return super.hasPermission(msg)
    }

    if (userController.userHasPremium(msg.guild.ownerID, this.client)) {
      return true
    }

    return `Only guilds with premium access can use the \`${this.options.name}\` command.`
  }
}
