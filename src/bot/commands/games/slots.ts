import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { stripIndents } from 'common-tags'
import { UserService } from '../../services'
import { Command } from '../../base'

const combinations: ReadonlyArray<any> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const reels: ReadonlyArray<any> = [
  ['🍇', '🍉', '🍌', '🍒', '🍓', '🍋', '💎', '🎉'],
  ['💎', '🍒', '🎉', '🍇', '🍌', '🍉', '🍋', '🍓'],
  ['🍓', '🍋', '💎', '🍌', '🍒', '🍉', '🍇', '🎉']
]

const values: { readonly [key: string]: number } = {
  '💎': 100,
  '🎉': 10,
  '🍉': 10,
  '🍋': 3,
  '🍇': 3,
  '🍒': 3,
  '🍓': 3,
  '🍌': 1
}

export default class SlotsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'slots',
      group: 'games',
      memberName: 'slots',
      description: 'Gamble on the slot machine.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'coins',
          prompt: stripIndents`**🎰 | Welcome to Slots!**

          The winnings are up to 100 times your bet.
          The odds are in your favor!

          The average odds are about 1:25

          Tips:
          Only bet an amount you have at least 50x the amount of.

          How many credits would you like to bet?\n`,
          type: 'integer',
          validate: (coins: number | string) => {
            if (isNaN(Number(coins)) || coins <= 0) {
              return 'Amount must be a number greater than zero.'
            }
            return true
          }
        }
      ]
    })
  }

  public async run(
    msg: CommandoMessage,
    args: any
  ): Promise<Message | ReadonlyArray<Message>> {
    const userService = new UserService()

    const isUserOwner = this.client.owners[0].id === msg.author.id

    const userId = msg.author.id
    const user = await userService
      .find(msg.author.id)
      .catch(_ => userService.create(msg.author))
      .catch(() => {
        // swallow
      })

    if (!user) {
      return msg.reply(
        'Command failed. You do not exist in my database. Try again.'
      )
    }

    if (user.balance.balance < Number(args.coins)) {
      return msg.reply(
        `Insufficient funds. You have ${user.balance.balance} credits`
      )
    }

    if (isUserOwner) {
      const roll = this.generateRoll()
      const winnings = 0

      combinations.forEach(combo => {
        if (
          roll[combo[0]] === roll[combo[1]] &&
          roll[combo[1]] === roll[combo[2]]
        ) {
          winnings += values[roll[combo[0]]]
        }
      })

      if (winnings === 0) {
        return msg.channel.send(stripIndents`**${
          msg.author.username
        }, you lost. Try again, you got this!

      ${this.showRoll(roll)}**`)
      }

      return msg.channel.send(stripIndents`**${msg.author.username}, you rolled:

      ${this.showRoll(roll)}

      You won ${winnings * args.coins} credits!**`)
    }

    const botOwnerId = this.client.owners[0].id
    const owner = await userService.find(botOwnerId)

    if (!owner) {
      return msg.reply('Failed to fetch bank account, woops.')
    }

    owner.balance.balance += args.coins
    owner.balance.netWorth += args.coins

    user.balance.balance -= args.coins
    user.balance.netWorth -= args.coins

    const roll = this.generateRoll()
    const winnings = 0

    combinations.forEach(combo => {
      if (
        roll[combo[0]] === roll[combo[1]] &&
        roll[combo[1]] === roll[combo[2]]
      ) {
        winnings += values[roll[combo[0]]]
      }
    })

    if (winnings === 0) {
      await userService.updateBalance(userId, user.balance)
      await userService.updateBalance(botOwnerId, owner.balance)

      return msg.channel.send(stripIndents`**${
        msg.author.username
      }, you lost. Try again, you got this!

      ${this.showRoll(roll)}**`)
    }

    owner.balance.balance -= winnings * args.coins
    owner.balance.netWorth -= winnings * args.coins

    user.balance.balance += winnings * args.coins
    user.balance.netWorth += winnings * args.coins

    await userService.updateBalance(userId, user.balance)
    await userService.updateBalance(botOwnerId, owner.balance)

    return msg.channel.send(stripIndents`**${msg.author.username}, you rolled:

    ${this.showRoll(roll)}

    You won ${winnings * args.coins} credits!**`)
  }

  public showRoll(roll: ReadonlyArray<string>) {
    return stripIndents`
			${roll[0]}ー${roll[1]}ー${roll[2]}
			${roll[3]}ー${roll[4]}ー${roll[5]}
      ${roll[6]}ー${roll[7]}ー${roll[8]}
    `
  }

  public generateRoll() {
    const roll: ReadonlyArray<string> = []
    reels.forEach((reel, index) => {
      const rand = Math.floor(Math.random() * reel.length)
      roll[index] = rand === 0 ? reel[reel.length - 1] : reel[rand - 1]
      roll[index + 3] = reel[rand]
      roll[index + 6] = rand === reel.length - 1 ? reel[0] : reel[rand + 1]
    })

    return roll
  }
}
