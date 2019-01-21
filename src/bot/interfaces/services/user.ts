import { User } from 'discord.js'
import { User as BotUser, UserBalance, UserProfile } from '../../../db'
import * as Promise from 'bluebird'
import { UserLevelBalance } from '../../../api/src/models'

export interface UserService {
  create: (user: User) => Promise<void>
  find: (id: string) => Promise<BotUser | undefined>
  updateBalance: (id: string, balance: UserBalance) => Promise<void>
  delete: (id: string) => Promise<void>
  updateProfile: (id: string, profile: UserProfile) => Promise<void>
  updateLevelBalance: (id: string, levelBalance: UserLevelBalance) => Promise<void>
}
