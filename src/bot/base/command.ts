import { Command as CommandoCommand } from 'discord.js-commando'
import { Message, Guild } from 'discord.js'

export class Command extends CommandoCommand {
  premiumOnly: boolean = false

  public isUsable(_msg: Message) {
    return !this.premiumOnly
  }

  public isEnabledIn(_guild: Guild) {
    return !this.premiumOnly
  }
}
