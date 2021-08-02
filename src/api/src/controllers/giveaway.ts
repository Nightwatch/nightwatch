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
import { GiveawayEvent } from '../constants'
import { GiveawayService } from '../services/giveaway'
import { SocketService } from '../services/socket'
import { BaseController } from '../interfaces/base-controller'
import { Giveaway } from '../../../db'
import { Types } from '../../../common'

/**
 * The Giveaway controller. Contains all endpoints for handling Giveaways.
 *
 * /api/giveaways
 */
@controller('/api/giveaways')
export class GiveawayController implements BaseController<Giveaway, number> {
  @inject(Types.GiveawayService)
  private readonly giveawayService: GiveawayService
  @inject(Types.SocketService) private readonly socketService: SocketService

  /**
   * Gets all giveaways from the database.
   *
   * GET /
   * @returns Promise<Giveaway[]>
   */
  @httpGet('/')
  public async find() {
    return this.giveawayService.find()
  }

  /**
   * Gets a giveaway by their ID.
   *
   * GET /:id
   * @returns Promise<Giveaway>
   */
  @httpGet('/:id')
  public async findById(@requestParam('id') id: number) {
    return this.giveawayService.findById(id)
  }

  /**
   * Creates a giveaway.
   *
   * POST /
   * @returns Promise<Giveaway>
   */
  @httpPost('/')
  public async create(@requestBody() giveaway: Giveaway) {
    const result = await this.giveawayService.create(giveaway)
    this.socketService.send(
      GiveawayEvent.GIVEAWAY_CREATE,
      this.redactKey(giveaway)
    )
    return result
  }

  /**
   * Hard deletes a giveaway.
   *
   * DELETE /:id
   * @returns Promise<Giveaway | undefined>
   */
  @httpDelete('/:id')
  public async deleteById(@requestParam('id') id: number) {
    await this.giveawayService.delete(id)
    this.socketService.send(GiveawayEvent.GIVEAWAY_DELETE, id)
  }

  /**
   * Updates a giveaway by ID.
   *
   * PUT /:id
   * @returns Promise<Giveaway>
   */
  @httpPut('/:id')
  public async updateById(
    @requestParam('id') id: number,
    @requestBody() giveaway: Giveaway
  ) {
    await this.giveawayService.update(id, giveaway)
    this.socketService.send(
      GiveawayEvent.GIVEAWAY_UPDATE,
      this.redactKey(giveaway)
    )
  }

  private redactKey(giveaway: Giveaway) {
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
