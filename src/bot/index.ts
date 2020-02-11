import { container } from './config/inversify'
import { Types } from '../common'
import { Bot } from './interfaces'
import * as Promise from 'bluebird'

/* prettier-ignore */
const bot = container.get<Bot>(Types.Bot)

Promise.resolve(bot.start()).catch(onError)

process.on('uncaughtException', onError)
process.on('disconnect', onError)

function onError(error?: Error) {
  if (error) {
    console.error(error)
  }

  // Will restart automatically
  process.exit(1)
}
