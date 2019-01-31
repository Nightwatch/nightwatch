import { GuildService as IGuildService } from '../interfaces'
import { Guild } from 'discord.js'
import { api } from '../utils'
import { Guild as BotGuild, GuildSettings, GuildSupportTicket, GuildSuggestion, GuildSelfAssignableRole } from '../../db'
import { injectable } from 'inversify'
import * as Promise from 'bluebird'

@injectable()
export class GuildService implements IGuildService {
  public create = (guild: Guild) => {
    return this.find(guild.id)
      .then(existingGuild => {
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

  public find = (id: string): Promise<BotGuild | undefined> => {
    const route = `/guilds/${id}`

    return Promise.resolve(api.get(route))
      .then(response => response.data)
  }

  public createSupportTicket = (id: string, ticket: GuildSupportTicket) => {
    const route = `/guilds/${id}/support-tickets`

    return Promise.resolve(api.post(route, ticket)).thenReturn()
  }

  public updateSupportTicket = (id: string, ticketId: number, ticket: GuildSupportTicket) => {
    const route = `/guilds/${id}/support-tickets/${ticketId}`

    return Promise.resolve(api.put(route, ticket)).thenReturn()
  }

  public createSuggestion = (id: string, ticket: GuildSuggestion) => {
    const route = `/guilds/${id}/suggestions`

    return Promise.resolve(api.post(route, ticket)).thenReturn()
  }

  public updateSuggestion = (id: string, ticketId: number, ticket: GuildSuggestion) => {
    const route = `/guilds/${id}/suggestions/${ticketId}`

    return Promise.resolve(api.put(route, ticket)).thenReturn()
  }

  public findSelfAssignableRoles = (id: string) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return Promise.resolve(api.get(route)).then(response => response.data)
  }

  public findSelfAssignableRole = (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return Promise.resolve(api.get(route)).then(response => response.data)
  }

  public createSelfAssignableRole = (id: string, selfAssignableRole: GuildSelfAssignableRole) => {
    const route = `/guilds/${id}/self-assignable-roles`

    return Promise.resolve(api.post(route, selfAssignableRole)).thenReturn()
  }

  public deleteSelfAssignableRole = (id: string, roleId: string) => {
    const route = `/guilds/${id}/self-assignable-roles/${roleId}`

    return Promise.resolve(api.delete(route)).thenReturn()
  }
}
