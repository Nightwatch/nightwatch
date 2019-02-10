import { GuildMember, Collection } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

export interface UserController {
  readonly getPremiumUsers: (
    client: CommandoClient
  ) => Collection<string, GuildMember> | undefined
  readonly userHasPremium: (id: string, client: CommandoClient) => boolean
}
