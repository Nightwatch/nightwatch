import { User } from 'discord.js'
import { User as BotUser, UserBalance, UserProfile } from '../../../db'
import * as Promise from 'bluebird'
import { UserLevelBalance } from '../../../api/src/models'

export interface UserService {
  readonly create: (user: User) => Promise<void>
  readonly find: (id: string) => Promise<BotUser | undefined>
  readonly updateBalance: (id: string, balance: UserBalance) => Promise<void>
  readonly delete: (id: string) => Promise<void>
  readonly updateProfile: (id: string, profile: UserProfile) => Promise<void>
  readonly updateLevelBalance: (
    id: string,
    levelBalance: UserLevelBalance
  ) => Promise<void>
}
