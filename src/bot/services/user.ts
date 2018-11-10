import { UserService as IUserService } from '../interfaces'
import { User } from 'discord.js'
import { api } from '../utils'
import { User as BotUser, UserLevel, UserVerification, UserSettings, UserBalance, UserProfile } from '../../db'
import { injectable } from 'inversify'

@injectable()
export class UserService implements IUserService {
  public createUser = async (user: User) => {
    const existingUser = await this.findById(user.id)

    if (existingUser) {
      return
    }

    const newUser = new BotUser()
    newUser.id = user.id
    newUser.name = user.username
    newUser.avatarUrl = user.avatarURL({ format: 'png', size: 512 } || null)
    newUser.dateLastMessage = null
    newUser.level = new UserLevel()
    newUser.verification = new UserVerification()
    newUser.settings = new UserSettings()
    newUser.balance = new UserBalance()
    newUser.profile = new UserProfile()

    try {
      await api.post('/users', newUser)
    } catch (error) {
      // swallow. may change later
    }
  }

  public findById = async (id: string): Promise<BotUser | undefined> => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      return undefined
    }
  }
}
