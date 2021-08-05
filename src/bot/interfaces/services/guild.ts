import { Guild, GuildMember } from 'discord.js'
import {
  Guild as BotGuild,
  GuildSupportTicket,
  GuildSuggestion,
  GuildSelfAssignableRole,
  Song,
  GuildUserMessage,
  GuildUser,
  GuildSettings,
  GuildUserBan,
  GuildUserKick,
  GuildUserWarning
} from '../../../db'

export interface GuildService {
  readonly create: (guild: Guild) => Promise<BotGuild | undefined>
  readonly find: (id: string) => Promise<BotGuild | undefined>
  readonly createSupportTicket: (
    id: string,
    ticket: GuildSupportTicket
  ) => Promise<GuildSupportTicket>
  readonly updateSupportTicket: (
    id: string,
    ticketId: number,
    ticket: GuildSupportTicket
  ) => Promise<GuildSupportTicket>
  readonly createSuggestion: (
    id: string,
    ticket: GuildSuggestion
  ) => Promise<GuildSuggestion>
  readonly updateSuggestion: (
    id: string,
    ticketId: number,
    ticket: GuildSuggestion
  ) => Promise<GuildSuggestion>
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
  readonly saveMessage: (id: string, userId: string, message: Pick<GuildUserMessage, 'content'>) => Promise<GuildUserMessage>
  readonly findUserById: (
    id: string,
    userId: string
  ) => Promise<GuildUser | undefined>
  readonly createUser: (id: string, userId: string, guildMember: GuildMember) => Promise<GuildUser>
  readonly updateWelcomeMessage: (id: string, message: string) => Promise<void>
  readonly findSettings: (
    id: string,
  ) => Promise<GuildSettings>
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
