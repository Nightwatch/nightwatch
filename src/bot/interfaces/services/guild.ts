import { Guild } from 'discord.js'
import { Guild as BotGuild, GuildSupportTicket, GuildSuggestion } from '../../../db'
import * as Promise from 'bluebird'

export interface GuildService {
  create: (guild: Guild) => Promise<void>
  find: (id: string) => Promise<BotGuild | undefined>
  createSupportTicket: (id: string, ticket: GuildSupportTicket) => Promise<void>
  updateSupportTicket: (id: string, ticketId: number, ticket: GuildSupportTicket) => Promise<void>
  createSuggestion: (id: string, ticket: GuildSuggestion) => Promise<void>
  updateSuggestion: (id: string, ticketId: number, ticket: GuildSuggestion) => Promise<void>
}
