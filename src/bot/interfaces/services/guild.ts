import { Guild } from 'discord.js'
import { Guild as BotGuild } from '../../../db'
import * as Promise from 'bluebird'

export interface GuildService {
  create: (guild: Guild) => Promise<void>
  find: (id: string) => Promise<BotGuild | undefined>
}
