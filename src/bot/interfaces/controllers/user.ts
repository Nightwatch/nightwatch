import { GuildMember, Collection } from 'discord.js'
import { Client } from 'bot-ts'

export interface UserController {
  readonly getPremiumUsers: (
    client: Client
  ) => Collection<string, GuildMember> | undefined
  readonly userHasPremium: (id: string, client: Client) => boolean
}
