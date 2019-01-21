import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import * as prettyMs from 'pretty-ms'
import { oneLine } from 'common-tags'
import { UserService } from '../../services'

export default class DailiesCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'dailies',
      group: 'economy',
      memberName: 'dailies',
      aliases: [ 'daily' ],
      description: 'Claim your daily reward.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const user = await new UserService().find(msg.author.id)

    if (!user) {
      return msg.reply('Command failed. You did not have a profile set up in my database.')
    }
    const lastClaimed = user.balance.dateLastClaimedDailies
      ? new Date(user.balance.dateLastClaimedDailies).getTime()
      : 0
    const rewardAmount = 200

    if (Date.now() - lastClaimed >= 86400000) {
      user.balance.balance += rewardAmount
      user.balance.netWorth += rewardAmount

      user.balance.dateLastClaimedDailies = new Date()

      await new UserService().updateBalance(msg.author.id, user.balance)

      const atmEmoji = '🏧'
      const dollarEmoji = '💵'

      return msg.channel.send(oneLine`**${atmEmoji} | ${msg.member.displayName},
        you received ${dollarEmoji} ${rewardAmount} daily credits!**`)
    }

    const bankEmoji = '🏦'
    const timeWait = prettyMs(
      parseInt(((Date.now() - (lastClaimed + 86400000)) * -1).toString(), 10),
      {
        verbose: true,
        secDecimalDigits: 0,
        msDecimalDigits: 0
      }
    )

    return msg.channel.send(oneLine`**${bankEmoji} | ${msg.member.displayName},
      you have already redeemed your daily credits. Please wait ${timeWait}**`)
  }
}
