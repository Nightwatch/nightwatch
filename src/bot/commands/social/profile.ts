import { CommandMessage } from 'discord.js-commando'
import * as Canvas from 'canvas'
import * as request from 'request-promise'
import * as path from 'path'
import * as fs from 'fs'
import { UserService } from '../../services'
import { UserLevel } from '../../../db'
import { Command } from '../../base'
import { Client } from '../../models'

export default class ProfileCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'profile',
      group: 'social',
      memberName: 'profile',
      description: "View a user's profile",
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'user',
          prompt: 'Whose profile would you like to view?\n',
          type: 'member',
          default: ''
        }
      ]
    })
  }

  public async run(msg: CommandMessage, args: any) {
    const userService = new UserService()

    const user = args.user || msg.member
    const { Image } = Canvas

    msg.channel.startTyping()

    const foundUser = await userService.find(user.id)

    if (!foundUser) {
      msg.channel.stopTyping()
      return msg.reply(
        'User not found in my database, so the command did not succeed.'
      )
    }

    const userProfile = foundUser.profile
    const userLevelEntry: UserLevel = foundUser.level
    const personalMessage = userProfile.bio
    const balance = foundUser.balance.balance
    const title = userProfile.title
    Canvas.registerFont(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'assets',
        'profile',
        'fonts',
        'Roboto.ttf'
      ),
      {
        family: 'Roboto'
      }
    ) // eslint-disable-line max-len
    Canvas.registerFont(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'assets',
        'profile',
        'fonts',
        'NotoEmoji-Regular.ttf'
      ),
      {
        family: 'Roboto'
      }
    ) // eslint-disable-line max-len
    const fillValue = Math.min(
      userLevelEntry.xp / this.getXpForLevel(userLevelEntry.level),
      1
    )

    const canvas = Canvas.createCanvas(300, 300)
    const ctx = canvas.getContext('2d')
    const lines = await this._wrapText(ctx, personalMessage, 110)
    const base = new Image()
    const cond = new Image()
    const generate = () => {
      // Environment Variables
      ctx.drawImage(base, 0, 0)
      ctx.scale(1, 1)
      ctx.patternQuality = 'billinear'
      ctx.filter = 'bilinear'
      ctx.antialias = 'subpixel'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowOffsetY = 2
      ctx.shadowBlur = 2

      // Username
      ctx.font = '20px Roboto'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(user.displayName + (title ? ' - ' + title : ''), 50, 173)

      // EXP
      ctx.font = '10px Roboto'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#3498DB'
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
      ctx.fillRect(10, 191, fillValue * 135, 17)

      // EXP
      ctx.font = '10px Roboto'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#333333'
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
      ctx.fillText(
        `EXP: ${userLevelEntry.xp}/${this.getXpForLevel(userLevelEntry.level)}`,
        78,
        203
      )

      // LVL
      ctx.font = '30px Roboto'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#E5E5E5'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.fillText('LVL.', 12, 235)

      // LVL Number
      ctx.font = '30px Roboto'
      ctx.fillStyle = '#E5E5E5'
      ctx.fillText(userLevelEntry.level, 86, 235)

      // Currency
      ctx.font = '14px Roboto'
      ctx.fillStyle = '#E5E5E5'
      ctx.fillText('Balance', 12, 287)

      // Currency Number
      ctx.font = '14px Roboto'
      ctx.fillStyle = '#E5E5E5'
      ctx.fillText(balance, 86, 287)

      // Info title
      ctx.font = '12px Roboto'
      ctx.fillStyle = '#333333'
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
      ctx.fillText('Info Box', 182, 207)

      // Info
      ctx.font = '12px Roboto'
      ctx.fillStyle = '#333333'
      lines.forEach((line, i) => {
        ctx.fillText(line, 162, (i + 18.6) * parseInt('12', 0))
      })

      // Image
      ctx.beginPath()
      ctx.arc(79, 76, 55, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.shadowBlur = 5
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
      ctx.drawImage(cond, 24, 21, 110, 110)
    }
    base.src = fs.readFileSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'assets',
        'profile',
        'backgrounds',
        `${userProfile.background}.png`
      )
    )
    // tslint:disable-next-line
    cond.src = await request({
      uri: user.user.displayAvatarURL,
      encoding: null
    })
    generate()

    msg.channel.stopTyping()

    return msg.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: 'profile.png' }]
    })
  }

  public _wrapText(
    ctx: any,
    text: string,
    maxWidth: number
  ): Promise<ReadonlyArray<string>> {
    return new Promise(resolve => {
      const words = text.split(' ')
      const lines: string[] = []
      let line = ''

      if (ctx.measureText(text).width < maxWidth) {
        return resolve([text])
      }

      while (words.length > 0) {
        let split = false
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const tmp = words[0]
          words[0] = tmp.slice(0, -1)

          if (!split) {
            split = true
            words.splice(1, 0, tmp.slice(-1))
          } else {
            words[1] = tmp.slice(-1) + words[1]
          }
        }

        if (ctx.measureText(line + words[0]).width < maxWidth) {
          line += `${words.shift()} `
        } else {
          lines.push(line)
          line = ''
        }

        if (words.length === 0) {
          lines.push(line)
        }
      }

      return resolve(lines)
    })
  }

  public getXpForLevel(level: number) {
    return 5 * level * level + 50 * level + 100
  }
}
