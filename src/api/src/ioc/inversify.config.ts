import { Container } from 'inversify'
import { Types } from '../../../common'
import './loader'

import {
  AuthenticationService as IAuthenticationService,
  GiveawayService as IGiveawayService,
  GuildService as IGuildService,
  ReferralService as IReferralService,
  SocketService as ISocketService,
  UserService as IUserService
} from '../interfaces'

import {
  GiveawayService,
  UserService,
  AuthenticationService,
  GuildService,
  ReferralService,
  SocketService
} from '../services'

const container = new Container()

/* prettier-ignore */
container.bind<IGuildService>(Types.GuildService).to(GuildService)
/* prettier-ignore */
container.bind<IUserService>(Types.UserService).to(UserService)
/* prettier-ignore */
container.bind<IGiveawayService>(Types.GiveawayService).to(GiveawayService)
/* prettier-ignore */
container.bind<IAuthenticationService>(Types.AuthenticationService).to(AuthenticationService)
/* prettier-ignore */
container.bind<IReferralService>(Types.ReferralService).to(ReferralService)
/* prettier-ignore */
container.bind<ISocketService>(Types.SocketService).to(SocketService)

export { container }
