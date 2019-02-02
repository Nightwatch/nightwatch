import { BaseService } from '../base-service'
import { Guild, GuildSuggestion, GuildSupportTicket, GuildSettings, GuildUser, GuildSelfAssignableRole } from '../../../../db'

export interface GuildService extends BaseService<Guild, string> {
  findSuggestions: (id: string) => Promise<GuildSuggestion[]>
  findSuggestionById: (_: string, suggestionId: number) => Promise<GuildSuggestion | undefined>
  createSuggestion: (_: string, suggestion: GuildSuggestion) => Promise<GuildSuggestion>
  deleteSuggestion: (_: string, suggestionId: number) => Promise<void>
  updateSuggestion: (_: string, suggestionId: number, suggestion: GuildSuggestion) => Promise<void>
  findSupportTickets: (id: string) => Promise<GuildSupportTicket[]>
  findSupportTicketById: (_: string, ticketId: number) => Promise<GuildSupportTicket | undefined>
  createSupportTicket: (_: string, supportTicket: GuildSupportTicket) => Promise<GuildSupportTicket>
  deleteSupportTicket: (_: string, ticketId: number) => Promise<void>
  updateSupportTicket: (_: string, ticketId: number, supportTicket: GuildSupportTicket) => Promise<void>
  findSettings: (id: string) => Promise<GuildSettings | undefined>
  updateSettings: (id: string, settings: GuildSettings) => Promise<void>
  findUsers: (id: string) => Promise<GuildUser[]>
  findUserById: (id: string, userId: string) => Promise<GuildUser | undefined>
  createUser: (_: string, user: GuildUser) => Promise<void>
  deleteUser: (id: string, userId: string) => Promise<void>
  updateUser: (id: string, userId: string, user: GuildUser) => Promise<void>
  findSelfAssignableRoles: (id: string) => Promise<GuildSelfAssignableRole[]>
  findSelfAssignableRole: (id: string, roleId: string) => Promise<GuildSelfAssignableRole | undefined>
  createSelfAssignableRole: (id: string, selfAssignableRole: GuildSelfAssignableRole) => Promise<void>
  deleteSelfAssignableRole: (id: string, roleId: string) => Promise<void>
}
