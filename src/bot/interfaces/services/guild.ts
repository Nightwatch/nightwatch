import { Guild } from 'discord.js'
import { Guild as BotGuild, GuildSupportTicket, GuildSuggestion, GuildSelfAssignableRole } from '../../../db'
import * as Promise from 'bluebird'

export interface GuildService {
  create: (guild: Guild) => Promise<void>
  find: (id: string) => Promise<BotGuild | undefined>
  createSupportTicket: (id: string, ticket: GuildSupportTicket) => Promise<GuildSupportTicket>
  updateSupportTicket: (id: string, ticketId: number, ticket: GuildSupportTicket) => Promise<void>
  createSuggestion: (id: string, ticket: GuildSuggestion) => Promise<GuildSuggestion>
  updateSuggestion: (id: string, ticketId: number, ticket: GuildSuggestion) => Promise<void>
  findSelfAssignableRoles: (id: string) => Promise<GuildSelfAssignableRole[]>
  findSelfAssignableRole: (id: string, roleId: string) => Promise<GuildSelfAssignableRole | undefined>
  createSelfAssignableRole: (id: string, selfAssignableRole: GuildSelfAssignableRole) => Promise<void>
  deleteSelfAssignableRole: (id: string, roleId: string) => Promise<void>
}
