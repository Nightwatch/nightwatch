import { GuildService as IGuildService } from '../interfaces'
import { Guild, GuildMember } from 'discord.js'
import { api } from '../utils'
import {
  Guild as BotGuild,
  GuildSettings,
  GuildSupportTicket,
  GuildSuggestion,
  GuildSelfAssignableRole,
  Song,
  GuildUserMessage,
  GuildUser,
  GuildUserBan,
  GuildUserKick,
  GuildUserWarning,
} from '../../db'
import { injectable } from 'inversify'

@injectable()
export class GuildService implements IGuildService {
  public readonly create = async (guild: Guild) => {
    const existingGuild = await this.find(guild.id).catch(() => null)

    if (existingGuild) {
      return existingGuild
    }

    const newGuild = new BotGuild()
    newGuild.id = guild.id
    newGuild.settings = new GuildSettings()
    newGuild.name = guild.name

    const postRoute = `/guilds`

    return api.post<BotGuild>(postRoute, newGuild).then(x => x.data)
  }

  public readonly find = async (id: string): Promise<BotGuild | undefined> => {
    const route = `/guilds/${id}`

    return api.get<BotGuild>(route).then(response => response.data)
  }

  public readonly createSupportTicket = async (
    id: string,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets`

    return api.post<GuildSupportTicket>(route, ticket).then(x => x.data)
  }

  public readonly updateSupportTicket = async (
    id: string,
    ticketId: number,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets/${ticketId}`

    return api.put<GuildSupportTicket>(route, ticket).then(x => x.data)
  }

  public readonly createSuggestion = async (id: string, ticket: GuildSuggestion) => {
    const route = `/guilds/${id}/suggestions`

    return api.post<GuildSuggestion>(route, ticket).then(x => x.data)
  }

  public readonly updateSuggestion = async (
    id: string,
    ticketId: number,
    ticket: GuildSuggestion
  ) => {
    const route = `/guilds/${id}/suggestions/${ticketId}`

    return api.put<GuildSuggestion>(route, ticket).then(x => x.data)
  }

  public readonly findSelfAssignableRoles = async (id: string) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return api.get<GuildSelfAssignableRole[]>(route).then(response => response.data)
  }

  public readonly findSelfAssignableRole = async (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return api.get<GuildSelfAssignableRole>(route).then(response => response.data)
  }

  public readonly createSelfAssignableRole = async (
    id: string,
    selfAssignableRole: GuildSelfAssignableRole
  ) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return api.post<GuildSelfAssignableRole>(route, selfAssignableRole).then(x => x.data)
  }

  public readonly deleteSelfAssignableRole = async (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    await api.delete(route)
  }

  public readonly findPlaylist = async (id: string) => {
    const route = `/guilds/${id}/playlist`

    return api.get(route).then(r => r.data)
  }

  public readonly findPlaylistSongsByUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/users/${userId}`

    return Promise.resolve(api.get(route)).then(r => r.data)
  }

  public readonly createSong = async (id: string, song: Song) => {
    const route = `/guilds/${id}/playlist`

    return api.post(route, song).then(r => r.data)
  }

  public readonly deleteSong = async (id: string, songId: number) => {
    const route = `/guilds/${id}/playlist/${songId}`

    await api.delete(route)
  }

  public readonly clearPlaylist = async (id: string) => {
    const route = `/guilds/${id}/playlist`

    await api.delete(route)
  }

  public readonly deleteSongsByUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/users/${userId}`

    await api.delete(route)
  }

  public readonly saveMessage = async (
    id: string,
    userId: string,
    message: Pick<GuildUserMessage, 'content'>
  ) => {
    const route = `/guilds/${id}/users/${userId}/messages`

    return api.post<GuildUserMessage>(route, message).then(x => x.data)
  }

  public readonly findUserById = async (id: string, userId: string) => {
    const route = `/guilds/${id}/users/${userId}`

    return api.get<GuildUser>(route).then(x => x.data)
  }

  public readonly createUser = async (id: string, userId: string, guildMember: GuildMember) => {
    const route = `/guilds/${id}/users/${userId}`

    const guildUser = new GuildUser()

    guildUser.nickname = guildMember.nickname || guildMember.displayName
    guildUser.dateJoined = guildMember.joinedAt || new Date()

    return api.post<GuildUser>(route, guildUser).then(x => x.data)
  }

  public readonly updateWelcomeMessage = async (id: string, message: string) => {
    const route = `/guilds/${id}/welcome-message`

    return api.put(route, {message}).then(x => x.data);
  }

  public readonly findSettings = async (id: string) => {
    const route = `/guilds/${id}/settings`

    return api.get<GuildSettings>(route).then(x => x.data)
  }

  public readonly createWarning = async (id: string, fromUserId: string, toUserId: string, warning: Pick<GuildUserWarning, 'reason'>) => {
    const route = `/guilds/${id}/warnings/from/${fromUserId}/to/${toUserId}`

    return api.post<GuildUserWarning>(route, warning).then(x => x.data);
  }

  public readonly createKick = async (id: string, fromUserId: string, toUserId: string, kick: Pick<GuildUserKick, 'reason'>) => {
    const route = `/guilds/${id}/kicks/from/${fromUserId}/to/${toUserId}`

    return api.post<GuildUserKick>(route, kick).then(x => x.data);
  }

  public readonly createBan = async (id: string, fromUserId: string, toUserId: string, ban: Pick<GuildUserBan, 'reason'>) => {
    const route = `/guilds/${id}/bans/from/${fromUserId}/to/${toUserId}`

    return api.post<GuildUserBan>(route, ban).then(x => x.data);
  }

  public readonly findWarnings = async (id: string) => {
    const route = `/guilds/${id}/warnings`

    return api.get<GuildUserWarning[]>(route).then(x => x.data);
  }

  public readonly findKicks = async (id: string) => {
    const route = `/guilds/${id}/kicks`

    return api.get<GuildUserKick[]>(route).then(x => x.data);
  }

  public readonly findBans = async (id: string) => {
    const route = `/guilds/${id}/bans`

    return api.get<GuildUserBan[]>(route).then(x => x.data);
  }

  public readonly findWarningsToUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/warnings/to/${userId}`

    return api.get<GuildUserWarning[]>(route).then(x => x.data);
  }

  public readonly findKicksToUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/kicks/to/${userId}`

    return api.get<GuildUserKick[]>(route).then(x => x.data);
  }

  public readonly findBansToUserId = async (id: string, userId: string) => {
    const route = `/guilds/${id}/bans/to/${userId}`

    return api.get<GuildUserBan[]>(route).then(x => x.data);
  }
}
