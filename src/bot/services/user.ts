import { UserService as IUserService } from '../interfaces'
import { User } from 'discord.js'
import { api } from '../utils'
import { User as BotUser, UserLevel, UserVerification, UserSettings, UserBalance, UserProfile } from '../../db'
import { injectable } from 'inversify'
import * as Promise from 'bluebird'

@injectable()
export class UserService implements IUserService {
  public create = (user: User) => {
    return this.find(user.id)
      .then(existingUser => {
        if (existingUser) {
          return
        }

        const newUser = new BotUser()
        newUser.id = user.id
        newUser.name = user.username
        newUser.avatarUrl = user.displayAvatarURL({ format: 'png', size: 512 })
        newUser.dateLastMessage = null
        newUser.level = new UserLevel()
        newUser.verification = new UserVerification()
        newUser.settings = new UserSettings()
        newUser.balance = new UserBalance()
        newUser.profile = new UserProfile()

        api.post('/users', newUser)
      })
      .thenReturn()
  }

  public find = (id: string): Promise<BotUser | undefined> => {
    return Promise.resolve(api.get(`/users/${id}`)).then(response => response.data)
  }

  public updateBalance = (id: string, balance: UserBalance) => {
    return Promise.resolve(api.put(`/users/${id}/balance`, balance)).thenReturn()
  }
}
