import { container } from './config/inversify'
import { Types } from '../common'
import { Bot } from './interfaces'

/* prettier-ignore */

process.on('uncaughtException', onError)
process.on('disconnect', onError)

function start() {
  const bot = container.get<Bot>(Types.Bot)
  bot
    .start()
    .then(() => {
      //
    })
    .catch(onError)
}

function onError(error?: Error) {
  if (error) {
    console.error(error)
  }

  // TODO: Make auto restarts work in Docker
  // Will restart automatically
  // process.exit(1)

  start()
}

start()
