import { Guild } from 'discord.js'
import { Guild as BotGuild } from '../../../db'

export interface GuildService {
  create: (guild: Guild) => Promise<void>
  find: (id: string) => Promise<BotGuild | undefined>
}
