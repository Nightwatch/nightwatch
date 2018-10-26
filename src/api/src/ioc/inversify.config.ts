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

container.bind<GuildService>(Types.GuildService).to(GuildService)
container.bind<UserService>(Types.UserService).to(UserService)
container.bind<GiveawayService>(Types.GiveawayService).to(GiveawayService)
container.bind<AuthenticationService>(Types.AuthenticationService).to(AuthenticationService)
container.bind<ReferralService>(Types.ReferralService).to(ReferralService)
container.bind<SocketService>(Types.SocketService).to(SocketService)

export { container }
