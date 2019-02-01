import { Command as CommandoCommand, CommandoMessage } from 'discord.js-commando'

export class Command extends CommandoCommand {
  premiumOnly: boolean = false

  public hasPermission(_msg: CommandoMessage) {
    if (!this.premiumOnly) {
      return true
    }

    return 'Only guilds with premium access can use this command.'
  }
}
