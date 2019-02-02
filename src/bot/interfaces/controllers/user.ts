import { GuildMember, Collection } from 'discord.js'
// import * as Promise from 'bluebird'
import { CommandoClient } from 'discord.js-commando'

export interface UserController {
  getPremiumUsers: (
    client: CommandoClient
  ) => Collection<string, GuildMember> | undefined
  userHasPremium: (id: string, client: CommandoClient) => boolean
}
