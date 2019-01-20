import { User } from 'discord.js'
import { User as BotUser } from '../../../db'
import * as Promise from 'bluebird'

export interface UserService {
  create: (user: User) => Promise<void>
  find: (id: string) => Promise<BotUser | undefined>
}
