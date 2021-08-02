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

    const guild = client.guilds.cache.find(x => x.id === config.optional.premium!.primaryGuildId)

    if (!guild) {
      return
    }

    var members = await guild.members.fetch()
    
    return members.filter(x =>
      !!x.roles.cache.find(x => x.id === config.optional.premium!.premiumPatreonRoleId!)
    )
  }

  public readonly userHasPremium = (id: string, client: Client) => {
    const user = client.users.cache.get(id)

    if (!user) {
      return false;
    }

    if (client.owners.includes(user)) {
      return true
    }

    if (
      !config.optional.premium ||
      !config.optional.premium.premiumPatreonRoleId ||
      !config.optional.premium.primaryGuildId
    ) {
      return false
    }

    const guild = client.guilds.cache.find(x => x.id === config.optional.premium!.primaryGuildId)

    if (!guild) {
      return false
    }

    const member = guild.members.cache.find(x => x.id === id)

    if (!member) {
      return false
    }

    return !!member.roles.cache.find(x => x.id === config.optional.premium!.premiumPatreonRoleId)
  }
}
