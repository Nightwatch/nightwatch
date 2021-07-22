import { GuildMember, Collection } from 'discord.js'
import { Client } from '../../models'

export interface UserController {
  readonly getPremiumUsers: (
    client: Client
  ) => Promise<Collection<string, GuildMember> | undefined>
  readonly userHasPremium: (id: string, client: Client) => boolean
}
