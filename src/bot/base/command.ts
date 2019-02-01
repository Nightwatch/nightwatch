import { Command as CommandoCommand } from 'discord.js-commando'
import { Message } from 'discord.js'

export class Command extends CommandoCommand {
  premiumOnly: boolean

  public isUsable(_msg: Message) {
    return !this.premiumOnly
  }
}
