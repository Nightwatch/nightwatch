import {
  Guild,
  GuildSuggestion,
  GuildSupportTicket,
  GuildSettings,
  GuildUser
} from '../../../db'
import { getRepository } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { injectable } from 'inversify'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@injectable()
export class GuildService implements BaseService<Guild, string> {
  private guildRepository = getRepository(Guild)
  private suggestionRepository = getRepository(GuildSuggestion)
  private supportTicketRepository = getRepository(GuildSupportTicket)
  private settingsRepository = getRepository(GuildSettings)
  private userRepository = getRepository(GuildUser)

  public find () {
    return this.guildRepository.find()
  }

  public async findById (id: string) {
    return this.guildRepository.findOne(id, {
      relations: ['settings', 'suggestions', 'supportTickets']
    })
  }

  public create (guild: Guild) {
    guild.dateCreated = new Date()
    return this.guildRepository.save(guild)
  }

  public update (_: string, guild: Guild) {
    return this.guildRepository.save(guild)
  }

  public async delete (id: string) {
    const guild = await this.guildRepository.findOne(id)

    if (!guild) {
      return
    }

    return this.guildRepository.remove(guild)
  }

  public findSuggestions (id: string) {
    return this.suggestionRepository.find({ where: { guildId: id } })
  }

  public findSuggestionById (_: string, suggestionId: number) {
    return this.suggestionRepository.findOne(suggestionId)
  }

  public createSuggestion (_: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date()
    return this.suggestionRepository.save(suggestion)
  }

  public async deleteSuggestion (_: string, suggestionId: number) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId)

    if (!suggestion) {
      return
    }

    return this.suggestionRepository.remove(suggestion)
  }

  public async updateSuggestion (
    _: string,
    suggestionId: number,
    suggestion: GuildSuggestion
  ) {
    return this.suggestionRepository.update(suggestionId, suggestion)
  }

  public findSupportTickets (id: string) {
    return this.supportTicketRepository.find({ where: { guild: { id } } })
  }

  public findSupportTicketById (_: string, ticketId: number) {
    return this.supportTicketRepository.findOne(ticketId)
  }

  public createSupportTicket (_: string, supportTicket: GuildSupportTicket) {
    supportTicket.dateCreated = new Date()
    return this.supportTicketRepository.save(supportTicket)
  }

  public async deleteSupportTicket (_: string, ticketId: number) {
    const ticket = await this.supportTicketRepository.findOne(ticketId)

    if (!ticket) {
      return
    }

    return this.supportTicketRepository.remove(ticket)
  }

  public async updateSupportTicket (
    _: string,
    ticketId: number,
    supportTicket: GuildSupportTicket
  ) {
    return this.supportTicketRepository.update(ticketId, supportTicket)
  }

  public async findSettings (id: string) {
    return this.settingsRepository.find({ where: { guild: { id } } })
  }

  public async updateSettings (id: string, settings: GuildSettings) {
    return this.settingsRepository.update({ guild: { id } }, settings)
  }

  public async findUsers (id: string) {
    return this.userRepository.find({ where: { guild: { id } } })
  }

  public findUserById (id: string, userId: string) {
    return this.userRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })
  }

  public async createUser (_: string, user: GuildUser) {
    user.dateJoined = new Date()
    return this.userRepository.save(user)
  }

  public async deleteUser (id: string, userId: string) {
    const user = await this.userRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })

    if (!user) {
      return
    }

    return this.userRepository.remove(user)
  }

  public async updateUser (id: string, userId: string, user: GuildUser) {
    return this.userRepository.update(
      { guild: { id }, user: { id: userId } },
      user
    )
  }
}
