import { Message, MessageAttachment } from 'discord.js'
import { User } from '../../../../db'
import { UserService } from '../../../services/user'
import { UserLevelBalance } from '../../../../api/src/models'
import * as path from 'path'

const timeForExp = 60 * 1000
const minExpPerMessage = 15
const maxExpPerMessage = 25

const userService = new UserService()

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getXpForLevel = (level: number) => {
  return 5 * level * level + 50 * level + 100
}

export const giveXp = async (user: User, message: Message) => {
  if (!user.settings.levelsEnabled) {
    return
  }

  const timeDiff: number = Date.now() - new Date(user.level.timestamp).getTime()

  if (timeDiff < timeForExp) {
    return
  }

  const entry: { readonly xp: number; readonly level: number } = user.level

  let experience: number = entry.xp
  let level: number = entry.level
  let experienceNext: number = getXpForLevel(level)
  let leveledup: boolean = false
  const expGain: number = getRandomNumber(maxExpPerMessage, minExpPerMessage)

  experience += expGain

  while (experience >= experienceNext) {
    experience -= experienceNext
    experienceNext = getXpForLevel(level)
    level++
    leveledup = true
  }

  if (leveledup) {
    const popcornEmoji = '🍿'

    let levelBonus = 0
    if (level % 100 === 0) {
      levelBonus = 1000
    } else if (level % 10 === 0) {
      levelBonus = 100
    } else if (level % 5 === 0) {
      levelBonus = 50
    }

    const levelBonusString =
      levelBonus > 0 ? `\n\n**Level Bonus! +${levelBonus} credits**` : ''

    user.balance.balance += levelBonus
    user.balance.netWorth += levelBonus

    const notifyLevelUp = level % 5 === 0 || level >= 10

    await userService.updateLevelBalance(message.author.id, {
      level: {
        xp: experience,
        level
      },
      balance: {
        balance: user.balance.balance,
        netWorth: user.balance.netWorth,
        dateLastClaimedDailies: user.balance.dateLastClaimedDailies
      }
    } as UserLevelBalance)

    if (!notifyLevelUp) {
      return
    }

    await message.channel.send(
      new MessageAttachment(
        path.join(__dirname, '../../../../../assets/level-up.png')
      )
    )

    await message.channel.send(
      `**${popcornEmoji} | ${
        message.member.displayName
      } just advanced to level ${level}**${levelBonusString}`
    )

    return
  }

  userService.updateLevelBalance(message.author.id, {
    level: {
      xp: experience,
      level
    }
  } as UserLevelBalance)
}
