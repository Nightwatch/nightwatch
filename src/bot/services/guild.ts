import { GuildService as IGuildService } from '../interfaces'
import { Guild } from 'discord.js'
import { api } from '../utils'
import { Guild as BotGuild, GuildSettings } from '../../db'
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

  public find = (id: string) => {
    const route = `/guilds/${id}`

    return Promise.resolve(api.get(route))
      .then(response => response.data)
  }
}
