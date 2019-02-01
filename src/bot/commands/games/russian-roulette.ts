import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { oneLine } from 'common-tags'
import { UserService } from '../../services'
import { Command } from '../../base'

const awardAmount: number = 1
const lossAmount: number = 10

export default class RussianRouletteCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'russianroulette',
      group: 'games',
      memberName: 'russianroulette',
      aliases: [ 'rr', 'gungame' ],
      description: oneLine`Test your luck with Russian Roulette.
        6 chambers, 1 bullet.
        Each win awards ${awardAmount} credit${awardAmount === 1 ? '' : 's'}
        for each bullet you bet, losing subtracts ${lossAmount}
        no matter how many bullets you use.`,
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'bullets',
          prompt: oneLine`How many bullets would you like to use?
            Your winnings are equal to the number of bullets used.\n`,
          type: 'integer',
          default: 1
        }
      ]
    })
  }

  public async run (
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
    if (args.bullets < 1 || args.bullets > 6) {
      return msg.reply('Number of bullets must be between 1 and 6.')
    }

    const userService = new UserService()

    const winAmount = awardAmount * args.bullets

    const userId = msg.author.id
    const user = await userService.find(userId)

    const botOwnerId = this.client.owners[0].id
    const owner = await userService.find(botOwnerId)

    if (!user || !owner) {
      return msg.reply('Command failed. Either you or the banker does not exist in the database.')
    }

    if (!owner) {
      return msg.reply('Failed to fetch bank account, woops.')
    }

    if (user.balance.balance < lossAmount) {
      return msg.reply(oneLine`Insufficient funds.
        You need at least ${lossAmount} credits to play.
        You only have ${user.balance.balance}`)
    }

    const gunEmoji = '🔫'
    const sentMessage = (await msg.reply(
      `${gunEmoji} \*slowly pulls trigger\*`
    )) as Message

    const bulletLocations: number[] = []
    for (let i = 0; i < args.bullets; i++) {
      let randomNumber = this.getRandomNumber(1, 6)
      while (bulletLocations.indexOf(randomNumber) >= 0) {
        randomNumber = this.getRandomNumber(1, 6)
      }
      bulletLocations.push(randomNumber)
    }

    const spin = this.getRandomNumber(1, 6)

    const dead = bulletLocations.indexOf(spin) >= 0

    const gunJammed =
      this.getRandomNumber(1, 20) === this.getRandomNumber(1, 20)

    if (dead && !gunJammed) {
      owner.balance.balance += lossAmount
      owner.balance.netWorth += lossAmount

      user.balance.balance -= lossAmount
      user.balance.netWorth -= lossAmount
    } else {
      owner.balance.balance -= winAmount
      owner.balance.netWorth -= winAmount

      user.balance.balance += winAmount
      user.balance.netWorth += winAmount
    }

    const isUserOwner = this.client.owners[0].id === msg.author.id

    if (!isUserOwner) {
      await userService.updateBalance(userId, user.balance)
      await userService.updateBalance(botOwnerId, owner.balance)
    }

    const loseMessage = oneLine`${gunEmoji} **Bang**.
      -${lossAmount} credit${lossAmount === 1 ? '' : 's'}`
    let winMessage = `${gunEmoji} *click*. +${winAmount} credit${winAmount === 1
      ? ''
      : 's'}`

    if (dead && gunJammed) {
      winMessage = oneLine`${gunEmoji} *click* *click* ... Gun jammed ...
        +${winAmount} credit${winAmount === 1 ? '' : 's'}`
    }

    return sentMessage.edit(
      `${msg.author}, ${dead && !gunJammed ? loseMessage : winMessage}.`
    )
  }

  public getRandomNumber (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
