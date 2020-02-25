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
import * as Promise from 'bluebird'
import { UserLevelBalance } from '../../api/src/models'

@injectable()
export class UserService implements IUserService {
  public readonly create = (user: User) => {
    return this.find(user.id)
      .catch(error => {
        if (error.response.status === 404) {
          const newUser = new BotUser()
          newUser.id = user.id
          newUser.name = user.username
          newUser.avatarUrl = user.displayAvatarURL
          newUser.dateLastMessage = null
          newUser.level = new UserLevel()
          newUser.verification = new UserVerification()
          newUser.settings = new UserSettings()
          newUser.balance = new UserBalance()
          newUser.profile = new UserProfile()

          api.post('/users', newUser)
        }
      })
      .thenReturn()
  }

  public readonly find = (id: string): Promise<BotUser | undefined> => {
    return Promise.resolve(api.get(`/users/${id}`)).then(
      response => response.data
    )
  }

  public readonly updateBalance = (id: string, balance: UserBalance) => {
    return Promise.resolve(
      api.put(`/users/${id}/balance`, balance)
    ).thenReturn()
  }

  public readonly delete = (id: string) => {
    return Promise.resolve(api.delete(`/users/${id}`)).thenReturn()
  }

  public readonly updateProfile = (id: string, profile: UserProfile) => {
    return Promise.resolve(
      api.put(`/users/${id}/profile`, profile)
    ).thenReturn()
  }

  public readonly updateLevelBalance = (
    id: string,
    levelBalance: UserLevelBalance
  ) => {
    return Promise.resolve(
      api.put(`/users/${id}/level`, levelBalance)
    ).thenReturn()
  }
}
