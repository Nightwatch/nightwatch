import { Command as CommandoCommand, CommandoMessage, CommandoClient } from 'discord.js-commando'

export class Command extends CommandoCommand {
  premiumOnly: boolean

  constructor(client: CommandoClient, info: any) {
    super(client, info)
    this.premiumOnly = info.premiumOnly || false
  }

  public hasPermission(msg: CommandoMessage) {
    if (!this.premiumOnly || this.client.isOwner(msg.author)) {
      return true
    }

    return `Only guilds with premium access can use the \`${this.name}\` command.`
  }
}
