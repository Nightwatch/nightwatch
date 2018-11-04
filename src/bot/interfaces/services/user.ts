import { GuildMember } from 'discord.js'

export interface UserService {
  createUser: (member: GuildMember) => Promise<void>
}
