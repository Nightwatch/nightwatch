import { UserService as IUserService } from '../interfaces'
import { User } from 'discord.js'
import { api } from '../utils'
import {
  User as BotUser,
  UserLevel,
  UserVerification,
  UserSettings,
  UserBalance,
  UserProfile
} from '../../db'
import { injectable } from 'inversify'
import { UserLevelBalance } from '../../api/src/models'

@injectable()
export class UserService implements IUserService {
  public readonly create = async (user: User) => {
    const newUser = new BotUser()
    newUser.id = user.id
    newUser.name = user.username
    newUser.avatarUrl = user.displayAvatarURL()
    newUser.dateLastMessage = null
    newUser.level = new UserLevel()
    newUser.verification = new UserVerification()
    newUser.settings = new UserSettings()
    newUser.balance = new UserBalance()
    newUser.profile = new UserProfile()

    return api.post<BotUser>('/users', newUser).then(x => x.data)
  }

  public readonly find = async (id: string): Promise<BotUser | undefined> => {
    return api.get(`/users/${id}`).then(
      response => response.data
    )
  }

  public readonly updateBalance = async (id: string, balance: UserBalance) => {
    return api.put(`/users/${id}/balance`, balance).then(x => x.data)
  }

  public readonly delete = async (id: string) => {
    await api.delete(`/users/${id}`)
  }

  public readonly updateProfile = async (id: string, profile: UserProfile) => {
    return api.put(`/users/${id}/profile`, profile).then(x => x.data)
  }

  public readonly updateLevelBalance = async (
    id: string,
    levelBalance: UserLevelBalance
  ) => {
    return api.put(`/users/${id}/level`, levelBalance).then(x => x.data)
  }
}
