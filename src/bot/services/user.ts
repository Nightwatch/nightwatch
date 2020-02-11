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
    await this.find(user.id).catch(error => {
      if (error.response.status === 404) {
        const newUser = new BotUser()
        newUser.id = user.id
        newUser.name = user.username
        newUser.avatarUrl = user.defaultAvatarURL
        newUser.dateLastMessage = null
        newUser.level = new UserLevel()
        newUser.verification = new UserVerification()
        newUser.settings = new UserSettings()
        newUser.balance = new UserBalance()
        newUser.profile = new UserProfile()

        api.post('/users', newUser)
      }
    })
  }

  public readonly find = (id: string): Promise<BotUser | undefined> => {
    return Promise.resolve(api.get(`/users/${id}`)).then(
      response => response.data
    )
  }

  public readonly updateBalance = async (id: string, balance: UserBalance) => {
    await Promise.resolve(api.put(`/users/${id}/balance`, balance))
  }

  public readonly delete = async (id: string) => {
    await Promise.resolve(api.delete(`/users/${id}`))
  }

  public readonly updateProfile = async (id: string, profile: UserProfile) => {
    await Promise.resolve(api.put(`/users/${id}/profile`, profile))
  }

  public readonly updateLevelBalance = async (
    id: string,
    levelBalance: UserLevelBalance
  ) => {
    await Promise.resolve(api.put(`/users/${id}/level`, levelBalance))
  }
}
