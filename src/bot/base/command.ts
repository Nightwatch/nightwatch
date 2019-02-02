import { Command as CommandoCommand, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { UserController } from '../controllers'

export class Command extends CommandoCommand {
  premiumOnly: boolean

  constructor(client: CommandoClient, info: any) {
    super(client, info)
    this.premiumOnly = info.premiumOnly || false
  }

  public hasPermission(msg: CommandoMessage) {
    if (!this.premiumOnly || this.client.isOwner(msg.author)) {
      return super.hasPermission(msg)
    }

    const userController = new UserController()

    if (userController.userHasPremium(msg.guild.ownerID, this.client)) {
      return true
    }

    return `Only guilds with premium access can use the \`${this.name}\` command.`
  }
}
