import { User } from 'discord.js'
import { User as BotUser, UserBalance, UserProfile } from '../../../db'
import { UserLevelBalance } from '../../../api/src/models'

export interface UserService {
  readonly create: (user: User) => Promise<BotUser>
  readonly find: (id: string) => Promise<BotUser | undefined>
  readonly updateBalance: (id: string, balance: UserBalance) => Promise<UserBalance>
  readonly delete: (id: string) => Promise<void>
  readonly updateProfile: (id: string, profile: UserProfile) => Promise<UserProfile>
  readonly updateLevelBalance: (
    id: string,
    levelBalance: UserLevelBalance
  ) => Promise<UserLevelBalance>
}
