import { CommandoClient } from 'discord.js-commando'
import { onMessage } from './lib/events'
import { Config } from '../../../common'

export class Plugin {
  public static config: Config
  public static client: CommandoClient
  public static readonly id = 'Levels'
  public static readonly description =
    'A leveling system that awards XP when users send messages. Also rewards credits when a user levels up.'

  /**
   * Initializes plugin
   */
  public async init(client: CommandoClient, config: Config) {
    Plugin.client = client
    Plugin.config = config
    await this.registerListeners(client)
  }

  /**
   * Register events
   */
  private async registerListeners(client: CommandoClient): Promise<void> {
    client.on('message', message => onMessage(message))
  }
}
