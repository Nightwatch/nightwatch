import { Command as CommandoCommand, CommandMessage } from 'discord.js-commando'
import { UserController } from '../controllers'
import { CommandInfo } from '../../common'
import { Client } from '../models'

const userController = new UserController()

export class Command extends CommandoCommand {
  public readonly premiumOnly: boolean
  public client: Client

  constructor(client: Client, info: CommandInfo) {
    super(client, info)
    this.premiumOnly = info.premiumOnly || false
  }

  public hasPermission(msg: CommandMessage) {
    if (!this.premiumOnly || this.client.isOwner(msg.author)) {
      return super.hasPermission(msg)
    }

    if (userController.userHasPremium(msg.guild.ownerID, this.client)) {
      return true
    }

    return `Only guilds with premium access can use the \`${this.name}\` command.`
  }
}
