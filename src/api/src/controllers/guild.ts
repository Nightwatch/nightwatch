import { Response } from 'express'
import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost,
  requestParam,
  requestBody,
  response
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { Events } from '../constants'
import { GuildService } from '../services/guild'
import { SocketService } from '../services/socket'
import { BaseController } from '../interfaces/base-controller'
import {
  Guild,
  GuildSupportTicket,
  GuildSettings,
  GuildUser,
  GuildSuggestion,
  GuildSelfAssignableRole
} from '../../../db'
import { Types } from '../../../common'

/**
 * The Guild controller. Contains all endpoints for handling Guilds and Guild data.
 *
 * /api/guilds
 * @class GuildController
 */
@controller('/api/guilds')
export class GuildController implements BaseController<Guild, string> {
  @inject(Types.GuildService) private guildService: GuildService
  @inject(Types.SocketService) private socketService: SocketService

  /**
   * Gets all guilds from the database, excluding most guild information.
   *
   * GET /
   * @returns Promise<Guild[]>
   * @memberof GuildController
   */
  @httpGet('/')
  async find () {
    return this.guildService.find()
  }

  /**
   * Gets a guild by their ID, including all guild information.
   *
   * GET /:id
   * @param {string} id The ID of the guild.
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpGet('/:id')
  async findById (@requestParam('id') id: string) {
    return this.guildService.findById(id)
  }

  /**
   * Creates a guild.
   *
   * POST /
   * @param {Request} request The request containing a `Guild` object.
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpPost('/')
  async create (@requestBody() guild: Guild) {
    await this.guildService.create(guild)
    this.socketService.send(Events.guild.created, guild)
  }

  /**
   * Hard deletes a guild.
   *
   * DELETE /:id
   * @param {string} id The ID of the guild.
   * @returns Promise<Guild | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: string) {
    await this.guildService.delete(id)
    this.socketService.send(Events.guild.deleted, id)
  }

  /**
   * Updates a guild by ID.
   *
   * PUT /:id
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `Guild` object.
   * @returns Promise<Guild>
   * @memberof GuildController
   */
  @httpPut('/:id')
  async updateById (
    @requestParam('id') id: string,
    @requestBody() guild: Guild
  ) {
    await this.guildService.update(id, guild)
    this.socketService.send(Events.guild.updated, guild)
  }

  /**
   * Gets all suggestions in a Guild
   *
   * GET /:id/suggestions
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSuggestion[]>
   * @memberof GuildController
   */
  @httpGet('/:id/suggestions')
  async findSuggestions (@requestParam('id') id: string) {
    return this.guildService.findSuggestions(id)
  }

  /**
   * Gets a Guild suggestion by ID.
   *
   * GET /:id/suggestions/:suggestionId
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @returns Promise<GuildSuggestion | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/suggestions/:suggestionId')
  async findSuggestionById (
    @requestParam('id') id: string,
    @requestParam('suggestionId') suggestionId: number
  ) {
    return this.guildService.findSuggestionById(id, suggestionId)
  }

  /**
   * Creates a suggestion in a Guild
   *
   * POST /:id/suggestions
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSuggestion` object.
   * @returns Promise<GuildSuggestion>
   * @memberof GuildController
   */
  @httpPost('/:id/suggestions')
  async createSuggestion (
    @requestParam('id') id: string,
    @requestBody() suggestion: GuildSuggestion
  ) {
    const ticket = await this.guildService.createSuggestion(
      id,
      suggestion
    )
    this.socketService.send(Events.guild.suggestion.created, suggestion)
    return ticket
  }

  /**
   * Updates a Guild suggestion by ID.
   *
   * PUT /:id/suggestions/:suggestionId
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @param {Request} request The request containing a `GuildSuggestion` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/suggestions/:suggestionId')
  async updateSuggestionById (
    @requestParam('id') id: string,
    @requestParam('suggestionId') suggestionId: number,
    @requestBody() suggestion: GuildSuggestion
  ) {
    await this.guildService.updateSuggestion(
      id,
      suggestionId,
      suggestion
    )
    this.socketService.send(Events.guild.suggestion.updated, suggestion)
  }

  /**
   * Deletes a Guild suggestion by ID.
   *
   * DELETE /:id/suggestions/:suggestionId
   * @param {string} id The ID of the guild.
   * @param {number} suggestionId The ID of the suggestion.
   * @returns Promise<GuildSuggestion | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/suggestions/:suggestionId')
  async deleteSuggestionById (
    @requestParam('id') id: string,
    @requestParam('suggestionId') suggestionId: number
  ) {
    await this.guildService.deleteSuggestion(id, suggestionId)
    this.socketService.send(Events.guild.suggestion.deleted, {
      guildId: id,
      suggestionId
    })
  }

  /**
   * Gets all support tickets in a Guild
   *
   * GET /:id/support-tickets
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSupportTicket[]>
   * @memberof GuildController
   */
  @httpGet('/:id/support-tickets')
  async findSupportTickets (@requestParam('id') id: string) {
    return this.guildService.findSupportTickets(id)
  }

  /**
   * Gets a Guild support ticket by ID.
   *
   * GET /:id/support-tickets/:ticketId
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @returns Promise<GuildSupportTicket | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/support-tickets/:ticketId')
  async findSupportTicketById (
    @requestParam('id') id: string,
    @requestParam('ticketId') ticketId: number
  ) {
    return this.guildService.findSupportTicketById(id, ticketId)
  }

  /**
   * Creates a support ticket in a Guild
   *
   * POST /:id/support-tickets
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSupportTicket` object.
   * @returns Promise<GuildSupportTicket>
   * @memberof GuildController
   */
  @httpPost('/:id/support-tickets')
  async createSupportTicket (
    @requestParam('id') id: string,
    @requestBody() supportTicket: GuildSupportTicket
  ) {
    const ticket = await this.guildService.createSupportTicket(
      id,
      supportTicket
    )
    this.socketService.send(Events.guild.supportTicket.created, supportTicket)
    return ticket
  }

  /**
   * Updates a Guild support ticket by ID.
   *
   * PUT /:id/support-tickets/:ticketId
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @param {Request} request The request containing a `GuildSupportTicket` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/support-tickets/:ticketId')
  async updateSupportTicketById (
    @requestParam('id') id: string,
    @requestParam('ticketId') ticketId: number,
    @requestBody() supportTicket: GuildSupportTicket
  ) {
    await this.guildService.updateSupportTicket(
      id,
      ticketId,
      supportTicket
    )
    this.socketService.send(Events.guild.supportTicket.updated, supportTicket)
  }

  /**
   * Deletes a Guild support ticket by ID.
   *
   * DELETE /:id/support-tickets/:ticketId
   * @param {string} id The ID of the guild.
   * @param {number} ticketId The ID of the support ticket.
   * @returns Promise<GuildSupportTicket | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/support-tickets/:ticketId')
  async deleteSupportTicketById (
    @requestParam('id') id: string,
    @requestParam('ticketId') ticketId: number
  ) {
    await this.guildService.deleteSupportTicket(
      id,
      ticketId
    )
    this.socketService.send(Events.guild.supportTicket.deleted, {
      guildId: id,
      ticketId
    })
  }

  /**
   * Gets a Guild's settings by ID.
   *
   * GET /:id/settings
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSettings[]>
   * @memberof GuildController
   */
  @httpGet('/:id/settings')
  async findSettingsById (@requestParam('id') id: string) {
    return this.guildService.findSettings(id)
  }

  /**
   * Updates a Guild's settings by ID.
   *
   * PUT /:id/settings
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildSettings` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/settings')
  async updateSettingsById (
    @requestParam('id') id: string,
    @requestBody() settings: GuildSettings
  ) {
    await this.guildService.updateSettings(id, settings)
    this.socketService.send(Events.guild.settingsUpdated, settings)
  }

  /**
   * Gets all users in a Guild.
   *
   * GET /:id/users
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildUser[]>
   * @memberof GuildController
   */
  @httpGet('/:id/users')
  async findUsers (@requestParam('id') id: string) {
    return this.guildService.findUsers(id)
  }

  /**
   * Gets a Guild user by ID.
   *
   * GET /:id/users/:userId
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @returns Promise<GuildUser | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/users/:userId')
  async findUserById (
    @requestParam('id') id: string,
    @requestParam('userId') userId: string
  ) {
    return this.guildService.findUserById(id, userId)
  }

  /**
   * Creates a user in a Guild
   *
   * POST /:id/users
   * @param {string} id The ID of the guild.
   * @param {Request} request The request containing a `GuildUser` object.
   * @returns Promise<GuildUser>
   * @memberof GuildController
   */
  @httpPost('/:id/users')
  async createUser (
    @requestParam('id') id: string,
    @requestBody() user: GuildUser
  ) {
    await this.guildService.createUser(id, user)
    this.socketService.send(Events.guild.user.created, user)
  }

  /**
   * Updates a Guild user by ID.
   *
   * PUT /:id/users/:userId
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @param {Request} request The request containing a `GuildUser` object.
   * @returns Promise<UpdateResult>
   * @memberof GuildController
   */
  @httpPut('/:id/users/:userId')
  async updateUserById (
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @requestBody() user: GuildUser
  ) {
    await this.guildService.updateUser(id, userId, user)
    this.socketService.send(Events.guild.user.updated, user)
  }

  /**
   * Deletes a Guild user by ID.
   *
   * DELETE /:id/users/:userId
   * @param {string} id The ID of the guild.
   * @param {string} userId The ID of the user.
   * @returns Promise<GuildUser | undefined>
   * @memberof GuildController
   */
  @httpDelete('/:id/users/:userId')
  async deleteUserById (
    @requestParam('id') id: string,
    @requestParam('userId') userId: string
  ) {
    await this.guildService.deleteUser(id, userId)
    this.socketService.send(Events.guild.user.deleted, {
      guildId: id,
      userId
    })
  }

  /**
   * Finds a Guild's self assignable roles.
   *
   * GET /:id/self-assignable-roles
   * @param {string} id The ID of the guild.
   * @returns Promise<GuildSelfAssignableRoles>
   * @memberof GuildController
   */
  @httpGet('/:id/self-assignable-roles')
  async findSelfAssignableRoles(@requestParam('id') id: string) {
    return this.guildService.findSelfAssignableRoles(id)
  }

  /**
   * Finds a Guild's self assignable role by Discord role ID.
   *
   * GET /:id/self-assignable-roles/:roleId
   * @param {string} id The ID of the guild.
   * @param {string} roleId The ID of the Discord role.
   * @returns Promise<GuildSelfAssignableRole | undefined>
   * @memberof GuildController
   */
  @httpGet('/:id/self-assignable-roles/:roleId')
  async findSelfAssignableRole(@requestParam('id') id: string, @requestParam('roleId') roleId: string) {
    return this.guildService.findSelfAssignableRole(id, roleId)
  }

  /**
   * Creates a self assignable role.
   *
   * POST /:id/self-assignable-roles
   * @param {string} id The ID of the guild.
   * @param {GuildSelfAssignableRole} selfAssignableRole The self assignable role object.
   * @returns Promise<void>
   * @memberof GuildController
   */
  @httpPost('/:id/self-assignable-roles')
  async createSelfAssignableRole(@requestParam('id') id: string, @requestBody() selfAssignableRole: GuildSelfAssignableRole, @response() res: Response) {
    const existingAssignableRole = await this.findSelfAssignableRole(id, selfAssignableRole.roleId)

    if (existingAssignableRole) {
      res.sendStatus(409)
      return
    }

    return this.guildService.createSelfAssignableRole(id, selfAssignableRole)
  }

  /**
   * Deletes a Guild self assignable role by Discord role ID.
   *
   * DELETE /:id/self-assignable-roles/:roleId
   * @param {string} id The ID of the guild.
   * @param {string} roleId The ID of the role.
   * @returns Promise<void>
   * @memberof GuildController
   */
  @httpDelete('/:id/self-assignable-roles/:roleId')
  async deleteSelfAssignableRole (
    @requestParam('id') id: string,
    @requestParam('roleId') roleId: string
  ) {
    await this.guildService.deleteSelfAssignableRole(id, roleId)
  }
}
