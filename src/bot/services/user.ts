import { UserService as IUserService } from '../interfaces'
import { GuildMember } from 'discord.js'
import { api } from '../utils'
import { User, UserLevel, UserVerification, UserSettings, UserBalance, UserProfile } from '../../db'
import { injectable } from 'inversify'

@injectable()
export class UserService implements IUserService {
  public createUser = async (member: GuildMember) => {
    const existingUser = await this.findUser(member.id)

    if (existingUser) {
      return
    }

    const guildUser = member.user

    const newUser = new User()
    newUser.id = guildUser.id
    newUser.name = guildUser.username
    newUser.avatarUrl = guildUser.avatarURL({ format: 'png', size: 512 } || null)
    newUser.dateLastMessage = null
    newUser.level = new UserLevel()
    newUser.verification = new UserVerification()
    newUser.settings = new UserSettings()
    newUser.balance = new UserBalance()
    newUser.profile = new UserProfile()

    const { data } = await api.post('/users', newUser)

    return data
  }

  public findUser = async (id: string) => {
    const { data } = await api.get(`/users/${id}`)

    return data
  }
}
