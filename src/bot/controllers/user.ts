import { inject, injectable } from 'inversify'
import { Types, Config } from '../../common'
import { UserController as IUserController, UserService } from '../interfaces'
import { Client } from '../models'

const config: Config = require('../../../config/config.json')

@injectable()
export class UserController implements IUserController {
  @inject(Types.UserService) public readonly userService: UserService

  public readonly getPremiumUsers = async (client: Client) => {
    if (
      !config.optional.premium ||
      !config.optional.premium.premiumPatreonRoleId ||
      !config.optional.premium.primaryGuildId
    ) {
      return
    }

    const guild = client.guilds.resolve(config.optional.premium.primaryGuildId)

    if (!guild) {
      return
    }

    var members = await guild.members.fetch()
    
    return members.filter(x =>
      !!x.roles.resolve(config.optional.premium!.premiumPatreonRoleId!)
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

    const guild = client.guilds.resolve(config.optional.premium.primaryGuildId)

    if (!guild) {
      return false
    }

    const member = guild.members.resolve(id)

    if (!member) {
      return false
    }

    return !!member.roles.resolve(config.optional.premium.premiumPatreonRoleId)
  }
}
