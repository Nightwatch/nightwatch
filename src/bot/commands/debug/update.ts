import * as simplegit from 'simple-git/promise'
import { Command } from '../../base'
import * as path from 'path'
import { Config } from '../../../common'
import { Client, Message } from 'bot-ts'
const config: Config = require('../../../../config/config.json')

export default class UpdateCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'update',
      group: 'debug',
      description: 'Updates the bot if a new update exists.',
      guildOnly: false,
      ownerOnly: true
    })
  }

  public async run(msg: Message) {
    const git = simplegit()

    await git.checkout('.')

    const result = await git.pull()
    let premiumUpdated = false

    try {
      try {
        const premiumPath = path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'src',
          'bot',
          'plugins',
          'plugin-premium'
        )
        await git.cwd(premiumPath)
        const premiumResult = await git.pull()

        if (premiumResult && premiumResult.summary.changes > 0) {
          premiumUpdated = true
        }
      } catch {
        if (
          config.optional &&
          config.optional.premium &&
          config.optional.premium.premiumPluginRepo
        ) {
          const repo = config.optional.premium.premiumPluginRepo

          await git.cwd(
            path.resolve(
              __dirname,
              '..',
              '..',
              '..',
              '..',
              'src',
              'bot',
              'plugins'
            )
          )
          await git.clone(repo, 'plugin-premium')
          premiumUpdated = true
        }
      }
    } catch (err) {
      // ¯\_(ツ)_/¯
    }

    if (!premiumUpdated && (!result || result.summary.changes === 0)) {
      return msg.reply('I am already up to date.')
    }

    await msg.channel.send('I have evolved! I will restart now.')

    return process.exit(0)
  }
}
