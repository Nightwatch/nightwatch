import { User } from 'discord.js'
import { User as BotUser } from '../../../db'

export interface UserService {
  createUser: (user: User) => Promise<void>
  findById: (id: string) => Promise<BotUser | undefined>
}
