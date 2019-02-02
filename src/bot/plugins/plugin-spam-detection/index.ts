import { CommandoClient } from 'discord.js-commando'
import { onMessage } from './lib/events'
import { Config } from '../../../common'

export class Plugin {
  public static config: Config
  public static client: CommandoClient
  public static premiumOnly = true
  public static id = 'Spam Detection'
  public static description =
    'Plugin to detect spam and punish the spammer.'

  /**
   * Initializes plugin
   * @param client
   * @param config
   */
  public async init(client: CommandoClient, config: Config) {
    Plugin.client = client
    Plugin.config = config
    await this.registerListeners(client)
  }

  /**
   * Register events
   * @param client
   */
  private async registerListeners(client: CommandoClient): Promise<void> {
    client.on('message', message => onMessage(message))
  }
}
