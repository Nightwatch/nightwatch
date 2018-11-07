import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost,
  requestParam,
  requestBody
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types, Events } from '../constants'
import { GiveawayService } from '../services/giveaway'
import { SocketService } from '../services/socket'
import { BaseController } from '../interfaces/base-controller'
import { Giveaway } from '../../../db'

/**
 * The Giveaway controller. Contains all endpoints for handling Giveaways.
 *
 * /api/giveaways
 * @class GiveawayController
 */
@controller('/api/giveaways')
export class GiveawayController implements BaseController<Giveaway, number> {
  @inject(Types.GiveawayService) private giveawayService: GiveawayService
  @inject(Types.SocketService) private socketService: SocketService

  /**
   * Gets all giveaways from the database.
   *
   * GET /
   * @returns Promise<Giveaway[]>
   * @memberof GiveawayController
   */
  @httpGet('/')
  async find () {
    return this.giveawayService.find()
  }

  /**
   * Gets a giveaway by their ID.
   *
   * GET /:id
   * @param {number} id The ID of the giveaway.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpGet('/:id')
  async findById (@requestParam('id') id: number) {
    return this.giveawayService.findById(id)
  }

  /**
   * Creates a giveaway.
   *
   * POST /
   * @param {Request} request The request containing a `Giveaway` object.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpPost('/')
  async create (@requestBody() giveaway: Giveaway) {
    await this.giveawayService.create(giveaway)
    this.socketService.send(
      Events.giveaway.created,
      this.redactKey(giveaway)
    )
  }

  /**
   * Hard deletes a giveaway.
   *
   * DELETE /:id
   * @param {number} id The ID of the giveaway.
   * @returns Promise<Giveaway | undefined>
   * @memberof GiveawayController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: number) {
    await this.giveawayService.delete(id)
    this.socketService.send(Events.giveaway.deleted, id)
  }

  /**
   * Updates a giveaway by ID.
   *
   * PUT /:id
   * @param {number} id The ID of the giveaway.
   * @param {Request} request The request containing a `Giveaway` object.
   * @returns Promise<Giveaway>
   * @memberof GiveawayController
   */
  @httpPut('/:id')
  async updateById (
    @requestParam('id') id: number,
    @requestBody() giveaway: Giveaway
  ) {
    await this.giveawayService.update(id, giveaway)
    this.socketService.send(
      Events.giveaway.updated,
      this.redactKey(giveaway)
    )
  }

  private redactKey (giveaway: Giveaway) {
    if (giveaway.items) {
      giveaway.items.forEach(item => {
        if (item.key) {
          item.key.key = ''
        }
      })
    }

    return giveaway
  }
}
