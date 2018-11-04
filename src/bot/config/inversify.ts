import 'reflect-metadata'

import { Container } from 'inversify'
import {
  GuildService as IGuildService,
  UserService as IUserService
} from '../interfaces'
import { GuildService, UserService } from '../services'
import { Types } from '../constants'

const container = new Container()

/* prettier-ignore */
container.bind<IGuildService>(Types.GuildService).to(GuildService)
/* prettier-ignore */
container.bind<IUserService>(Types.UserService).to(UserService)

export { container }
