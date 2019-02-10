import { GuildService as IGuildService } from '../interfaces'
import { Guild } from 'discord.js'
import { api } from '../utils'
import {
  Guild as BotGuild,
  GuildSettings,
  GuildSupportTicket,
  GuildSuggestion,
  GuildSelfAssignableRole,
  Song
} from '../../db'
import { injectable } from 'inversify'
import * as Promise from 'bluebird'

@injectable()
export class GuildService implements IGuildService {
  public readonly create = (guild: Guild) => {
    return this.find(guild.id).then(existingGuild => {
      if (existingGuild) {
        return
      }

      const newGuild = new BotGuild()
      newGuild.id = guild.id
      newGuild.settings = new GuildSettings()
      newGuild.name = guild.name

      const postRoute = `/guilds`

      api.post(postRoute, newGuild)
    })
  }

  public readonly find = (id: string): Promise<BotGuild | undefined> => {
    const route = `/guilds/${id}`

    return Promise.resolve(api.get(route)).then(response => response.data)
  }

  public readonly createSupportTicket = (
    id: string,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets`

    return Promise.resolve(api.post(route, ticket)).then(x => x.data)
  }

  public readonly updateSupportTicket = (
    id: string,
    ticketId: number,
    ticket: GuildSupportTicket
  ) => {
    const route = `/guilds/${id}/support-tickets/${ticketId}`

    return Promise.resolve(api.put(route, ticket)).thenReturn()
  }

  public readonly createSuggestion = (id: string, ticket: GuildSuggestion) => {
    const route = `/guilds/${id}/suggestions`

    return Promise.resolve(api.post(route, ticket)).then(x => x.data)
  }

  public readonly updateSuggestion = (
    id: string,
    ticketId: number,
    ticket: GuildSuggestion
  ) => {
    const route = `/guilds/${id}/suggestions/${ticketId}`

    return Promise.resolve(api.put(route, ticket)).thenReturn()
  }

  public readonly findSelfAssignableRoles = (id: string) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return Promise.resolve(api.get(route)).then(response => response.data)
  }

  public readonly findSelfAssignableRole = (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return Promise.resolve(api.get(route)).then(response => response.data)
  }

  public readonly createSelfAssignableRole = (
    id: string,
    selfAssignableRole: GuildSelfAssignableRole
  ) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return Promise.resolve(api.post(route, selfAssignableRole)).thenReturn()
  }

  public readonly deleteSelfAssignableRole = (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return Promise.resolve(api.delete(route)).thenReturn()
  }

  public readonly findPlaylist = (id: string) => {
    const route = `/guilds/${id}/playlist`

    return Promise.resolve(api.get(route)).then(r => r.data)
  }

  public readonly findPlaylistSongsByUserId = (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/user/${userId}`

    return Promise.resolve(api.get(route)).then(r => r.data)
  }

  public readonly createSong = (id: string, song: Song) => {
    const route = `/guilds/${id}/playlist`

    return Promise.resolve(api.post(route, song)).then(r => r.data)
  }

  public readonly deleteSong = (id: string, songId: number) => {
    const route = `/guilds/${id}/playlist/${songId}`

    return Promise.resolve(api.delete(route)).thenReturn()
  }

  public readonly clearPlaylist = (id: string) => {
    const route = `/guilds/${id}/playlist`

    return Promise.resolve(api.delete(route)).thenReturn()
  }

  public readonly deleteSongsByUserId = (id: string, userId: string) => {
    const route = `/guilds/${id}/playlist/user/${userId}`

    return Promise.resolve(api.delete(route)).thenReturn()
  }
}
