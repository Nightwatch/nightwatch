import 'reflect-metadata'

import { Container } from 'inversify'
import {
  GuildService as IGuildService,
  UserService as IUserService,
  Bot as IBot,
  EventController as IEventController
} from '../interfaces'
import { GuildService, UserService } from '../services'
import { Types } from '../constants'
import { Bot } from '../bot'
import { EventController } from '../controllers'

const container = new Container()

/* prettier-ignore */
container.bind<IBot>(Types.Bot).to(Bot)
/* prettier-ignore */
container.bind<IEventController>(Types.EventController).to(EventController)
/* prettier-ignore */
container.bind<IGuildService>(Types.GuildService).to(GuildService)
/* prettier-ignore */
container.bind<IUserService>(Types.UserService).to(UserService)

export { container }
