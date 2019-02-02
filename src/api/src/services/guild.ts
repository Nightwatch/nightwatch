import {
  Guild,
  GuildSuggestion,
  GuildSupportTicket,
  GuildSettings,
  GuildUser,
  GuildSelfAssignableRole
} from '../../../db'
import { getRepository } from 'typeorm'
import { injectable } from 'inversify'
import { GuildService as IGuildService } from '../interfaces'

/**
 * Guild service that handles storing and modifying guild data
 *
 * @class GuildService
 */
@injectable()
export class GuildService implements IGuildService {
  private guildRepository = getRepository(Guild)
  private suggestionRepository = getRepository(GuildSuggestion)
  private supportTicketRepository = getRepository(GuildSupportTicket)
  private settingsRepository = getRepository(GuildSettings)
  private userRepository = getRepository(GuildUser)
  private selfAssignableRoleRepository = getRepository(GuildSelfAssignableRole)

  public find () {
    return this.guildRepository.find()
  }

  public async findById (id: string) {
    return this.guildRepository.findOne(id, {
      relations: ['settings', 'suggestions', 'supportTickets']
    })
  }

  public async create (guild: Guild) {
    guild.dateCreated = new Date()
    await this.guildRepository.save(guild)
  }

  public async update (_: string, guild: Guild) {
    await this.guildRepository.save(guild)
  }

  public async delete (id: string) {
    const guild = await this.guildRepository.findOne(id)

    if (!guild) {
      return
    }

    await this.guildRepository.remove(guild)
  }

  public async findSuggestions (id: string) {
    return this.suggestionRepository.find({ where: { guildId: id } })
  }

  public async findSuggestionById (_: string, suggestionId: number) {
    return this.suggestionRepository.findOne(suggestionId)
  }

  public async createSuggestion (_: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date()
    return this.suggestionRepository.save(suggestion)
  }

  public async deleteSuggestion (_: string, suggestionId: number) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId)

    if (!suggestion) {
      return
    }

    await this.suggestionRepository.remove(suggestion)
  }

  public async updateSuggestion (
    _: string,
    suggestionId: number,
    suggestion: GuildSuggestion
  ) {
    await this.suggestionRepository.update(suggestionId, suggestion)
  }

  public findSupportTickets (id: string) {
    return this.supportTicketRepository.find({ where: { guild: { id } } })
  }

  public findSupportTicketById (_: string, ticketId: number) {
    return this.supportTicketRepository.findOne(ticketId)
  }

  public async createSupportTicket (_: string, supportTicket: GuildSupportTicket) {
    supportTicket.dateCreated = new Date()
    return this.supportTicketRepository.save(supportTicket)
  }

  public async deleteSupportTicket (_: string, ticketId: number) {
    const ticket = await this.supportTicketRepository.findOne(ticketId)

    if (!ticket) {
      return
    }

    await this.supportTicketRepository.remove(ticket)
  }

  public async updateSupportTicket (
    _: string,
    ticketId: number,
    supportTicket: GuildSupportTicket
  ) {
    await this.supportTicketRepository.update(ticketId, supportTicket)
  }

  public async findSettings (id: string) {
    return this.settingsRepository.findOne({ where: { guild: { id } } })
  }

  public async updateSettings (id: string, settings: GuildSettings) {
    await this.settingsRepository.update({ guild: { id } }, settings)
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
    await this.userRepository.save(user)
  }

  public async deleteUser (id: string, userId: string) {
    const user = await this.userRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })

    if (!user) {
      return
    }

    await this.userRepository.remove(user)
  }

  public async updateUser (id: string, userId: string, user: GuildUser) {
    await this.userRepository.update(
      { guild: { id }, user: { id: userId } },
      user
    )
  }

  public async findSelfAssignableRoles (id: string) {
    return this.selfAssignableRoleRepository.find({ where: { guild: { id } } })
  }

  public async findSelfAssignableRole (id: string, roleId: string) {
    return this.selfAssignableRoleRepository.findOne({ where: { guild: { id }, roleId } })
  }

  public async createSelfAssignableRole (_: string, selfAssignableRole: GuildSelfAssignableRole) {
    await this.selfAssignableRoleRepository.save(selfAssignableRole)
  }

  public async deleteSelfAssignableRole (id: string, roleId: string) {
    const selfAssignableRole = await this.selfAssignableRoleRepository.findOne({ where: { guild: { id }, roleId } })

    if (!selfAssignableRole) {
      return
    }

    await this.selfAssignableRoleRepository.remove(selfAssignableRole)
  }

}
