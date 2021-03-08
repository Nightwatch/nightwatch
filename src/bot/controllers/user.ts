import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import { UserController as IUserController, UserService } from '../interfaces'
import { Client } from '../models'

const config: Config = require('../../../config/config.json')

@injectable()
export class UserController implements IUserController {
  @inject(Types.UserService) public readonly userService: UserService

  public readonly getPremiumUsers = (client: Client) => {
    if (
      !config.optional.premium ||
      !config.optional.premium.premiumPatreonRoleId ||
      !config.optional.premium.primaryGuildId
    ) {
      return
    }

    const guild = client.guilds.get(config.optional.premium.primaryGuildId)

    if (!guild) {
      return
    }

    return guild.members.filter(x =>
      x.roles.has(config.optional.premium!.premiumPatreonRoleId!)
    )
  }

  public readonly userHasPremium = (id: string, client: Client) => {
    if (client.isOwner(id)) {
      return true
    }

    if (
      !config.optional.premium ||
      !config.optional.premium.premiumPatreonRoleId ||
      !config.optional.premium.primaryGuildId
    ) {
      return false
    }

    const guild = client.guilds.get(config.optional.premium.primaryGuildId)

    if (!guild) {
      return false
    }

    const member = guild.members.get(id)

    if (!member) {
      return false
    }

    return member.roles.has(config.optional.premium.premiumPatreonRoleId)
  }
}
