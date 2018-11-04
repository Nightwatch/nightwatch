import { Guild } from 'discord.js'

export interface GuildService {
  createGuild: (guild: Guild) => Promise<void>
}
