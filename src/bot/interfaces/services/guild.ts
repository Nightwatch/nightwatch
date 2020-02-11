import { Guild } from 'discord.js'
import {
  Guild as BotGuild,
  GuildSupportTicket,
  GuildSuggestion,
  GuildSelfAssignableRole,
  Song
} from '../../../db'

export interface GuildService {
  readonly create: (guild: Guild) => Promise<void>
  readonly find: (id: string) => Promise<BotGuild | undefined>
  readonly createSupportTicket: (
    id: string,
    ticket: GuildSupportTicket
  ) => Promise<GuildSupportTicket>
  readonly updateSupportTicket: (
    id: string,
    ticketId: number,
    ticket: GuildSupportTicket
  ) => Promise<void>
  readonly createSuggestion: (
    id: string,
    ticket: GuildSuggestion
  ) => Promise<GuildSuggestion>
  readonly updateSuggestion: (
    id: string,
    ticketId: number,
    ticket: GuildSuggestion
  ) => Promise<void>
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
  ) => Promise<void>
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
}
