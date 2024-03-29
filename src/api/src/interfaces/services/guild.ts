import { BaseService } from '../base-service'
import {
  Guild,
  GuildSuggestion,
  GuildSupportTicket,
  GuildSettings,
  GuildUser,
  GuildSelfAssignableRole,
  Song,
  GuildUserMessage,
  GuildUserWarning,
  GuildUserKick,
  GuildUserBan
} from '../../../../db'

export interface GuildService extends BaseService<Guild, string> {
  readonly findSuggestions: (
    id: string
  ) => Promise<ReadonlyArray<GuildSuggestion>>
  readonly findSuggestionById: (
    _: string,
    suggestionId: number
  ) => Promise<GuildSuggestion | undefined>
  readonly createSuggestion: (
    _: string,
    suggestion: GuildSuggestion
  ) => Promise<GuildSuggestion>
  readonly deleteSuggestion: (_: string, suggestionId: number) => Promise<void>
  readonly updateSuggestion: (
    _: string,
    suggestionId: number,
    suggestion: GuildSuggestion
  ) => Promise<GuildSuggestion>
  readonly findSupportTickets: (
    id: string
  ) => Promise<ReadonlyArray<GuildSupportTicket>>
  readonly findSupportTicketById: (
    _: string,
    ticketId: number
  ) => Promise<GuildSupportTicket | undefined>
  readonly createSupportTicket: (
    _: string,
    supportTicket: GuildSupportTicket
  ) => Promise<GuildSupportTicket>
  readonly deleteSupportTicket: (_: string, ticketId: number) => Promise<void>
  readonly updateSupportTicket: (
    _: string,
    ticketId: number,
    supportTicket: GuildSupportTicket
  ) => Promise<GuildSupportTicket>
  readonly findSettings: (id: string) => Promise<GuildSettings | undefined>
  readonly updateSettings: (
    id: string,
    settings: GuildSettings
  ) => Promise<GuildSettings>
  readonly findUsers: (id: string) => Promise<ReadonlyArray<GuildUser>>
  readonly findUserById: (
    id: string,
    userId: string
  ) => Promise<GuildUser | undefined>
  readonly createUser: (id: string, userId: string, user: GuildUser) => Promise<GuildUser>
  readonly deleteUser: (id: string, userId: string) => Promise<void>
  readonly updateUser: (
    id: string,
    userId: string,
    user: GuildUser
  ) => Promise<GuildUser>
  readonly findSelfAssignableRoles: (
    id: string
  ) => Promise<ReadonlyArray<GuildSelfAssignableRole>>
  readonly findSelfAssignableRole: (
    id: string,
    roleId: string
  ) => Promise<GuildSelfAssignableRole | undefined>
  readonly createSelfAssignableRole: (
    id: string,
    selfAssignableRole: GuildSelfAssignableRole
  ) => Promise<GuildSelfAssignableRole>
  readonly deleteSelfAssignableRole: (
    id: string,
    roleId: string
  ) => Promise<void>
  readonly findPlaylist: (id: string) => Promise<ReadonlyArray<Song>>
  readonly findPlaylistSongsByUserId: (
    id: string,
    userId: string
  ) => Promise<ReadonlyArray<Song>>
  readonly createSong: (id: string, song: Song) => Promise<Song>
  readonly deleteSong: (id: string, songId: number) => Promise<void>
  readonly clearPlaylist: (id: string) => Promise<void>
  readonly deleteSongsByUserId: (id: string, userId: string) => Promise<void>
  readonly findMessagesByUserId: (id: string, userId: string) => Promise<ReadonlyArray<GuildUserMessage>>
  readonly findMessages: (id: string) => Promise<ReadonlyArray<GuildUserMessage>>
  readonly createMessage: (id: string, userId: string, message: Pick<GuildUserMessage, 'content'>) => Promise<GuildUserMessage>
  readonly updateWelcomeMessage: (id: string, message: string) => Promise<void>
  readonly createWarning: (id: string, fromUserId: string, toUserId: string, warning: Pick<GuildUserWarning, 'reason'>) => Promise<GuildUserWarning>
  readonly findWarnings: (id: string) => Promise<GuildUserWarning[]>
  readonly findWarningsToUserId: (id: string, userId: string) => Promise<GuildUserWarning[]>
  readonly createKick: (id: string, fromUserId: string, toUserId: string, kick: Pick<GuildUserKick, 'reason'>) => Promise<GuildUserKick>
  readonly findKicks: (id: string) => Promise<GuildUserKick[]>
  readonly findKicksToUserId: (id: string, userId: string) => Promise<GuildUserKick[]>
  readonly createBan: (id: string, fromUserId: string, toUserId: string, kick: Pick<GuildUserBan, 'reason'>) => Promise<GuildUserBan>
  readonly findBans: (id: string) => Promise<GuildUserBan[]>
  readonly findBansToUserId: (id: string, userId: string) => Promise<GuildUserBan[]>
}
