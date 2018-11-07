import { container } from './config/inversify'
import { Types } from './constants'
import { Bot } from './interfaces'

/* prettier-ignore */
const bot = container.get<Bot>(Types.Bot)

bot.start().catch(onError)

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)
process.on('disconnect', onError)

function onError(error?: Error) {
  if (error) {
    console.error(error)
  }

  setTimeout(bot.start, 5000)
}
