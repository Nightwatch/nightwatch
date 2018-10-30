import { Container } from 'inversify'
import { Types } from '../constants'
import './loader'
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
container.bind<GuildService>(Types.GuildService).to(GuildService)
/* prettier-ignore */
container.bind<UserService>(Types.UserService).to(UserService)
/* prettier-ignore */
container.bind<GiveawayService>(Types.GiveawayService).to(GiveawayService)
/* prettier-ignore */
container.bind<AuthenticationService>(Types.AuthenticationService).to(AuthenticationService)
/* prettier-ignore */
container.bind<ReferralService>(Types.ReferralService).to(ReferralService)
/* prettier-ignore */
container.bind<SocketService>(Types.SocketService).to(SocketService)

export { container }
