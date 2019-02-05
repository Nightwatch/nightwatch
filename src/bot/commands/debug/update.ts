import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import * as simplegit from 'simple-git/promise'
import { Command } from '../../base'
import * as path from 'path'
import { Config } from '../../../common'
const config: Config = require('../../../../config/config.json')
import * as rimraf from 'rimraf'

export default class UpdateCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'update',
      group: 'debug',
      memberName: 'update',
      description: 'Updates the bot if a new update exists.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const git = simplegit()

    await git.checkout('.')

    const result = await git.pull()

    try {
      const premium = await git.cwd(path.join(__dirname, '..', '..', '..', 'src', 'plugins', 'plugin-premium'))
        .catch(() => undefined)

      if (config.optional && config.optional.premium && config.optional.premium.premiumPluginRepo) {
        const repo = config.optional.premium.premiumPluginRepo

        if (premium) {
          await rimraf.__promisify__(premium)
        }

        await git.clone(repo, path.join(__dirname, '..', '..', '..', 'src', 'plugins'))
      }
    } catch (err) {
      await msg.channel.send(err)
    }

    if (!result || result.summary.changes === 0) {
      return msg.reply('I am already up to date.')
    }

    await msg.channel.send('I have evolved! I will restart now.')

    return process.exit(1)
  }
}
