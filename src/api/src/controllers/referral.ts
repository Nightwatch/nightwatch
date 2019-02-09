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
import { ReferralEvent } from '../constants'
import { SocketService } from '../services/socket'
import { Referral } from '../../../db'
import { ReferralService } from '../services/referral'
import { BaseController } from '../interfaces/base-controller'
import { Types } from '../../../common'

/**
 * The referral controller. Contains all endpoints for the referral system.
 *
 * /api/referrals
 * @class ReferralController
 */
@controller('/api/referrals')
export class ReferralController implements BaseController<Referral, number> {
  @inject(Types.ReferralService) private referralService: ReferralService
  @inject(Types.SocketService) private socketService: SocketService

  /**
   * Gets all referrals from the database, excluding most related information.
   *
   * GET /
   * @returns Promise<Referral[]>
   * @memberof ReferralController
   */
  @httpGet('/')
  public async find() {
    return this.referralService.find()
  }

  /**
   * Gets a referral by its ID, including all related information.
   *
   * GET /:id
   * @param {number} id The ID of the referral.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpGet('/:id')
  public async findById(@requestParam('id') id: number) {
    return this.referralService.findById(id)
  }

  /**
   * Creates a referral.
   *
   * POST /
   * @param {Request} request The request containing a `Referral` object.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpPost('/')
  public async create(@requestBody() referral: Referral) {
    await this.referralService.create(referral)
    this.socketService.send(ReferralEvent.REFERRAL_CREATE, referral)
  }

  /**
   * Hard deletes a referral.
   *
   * DELETE /:id
   * @param {number} id The ID of the referral.
   * @returns Promise<Referral | undefined>
   * @memberof ReferralController
   */
  @httpDelete('/:id')
  public async deleteById(@requestParam('id') id: number) {
    await this.referralService.delete(id)
    this.socketService.send(ReferralEvent.REFERRAL_DELETE, id)
  }

  /**
   * Updates a referral by ID.
   *
   * PUT /:id
   * @param {number} id The ID of the referral.
   * @param {Request} request The request containing a `Referral` object.
   * @returns Promise<Referral>
   * @memberof ReferralController
   */
  @httpPut('/:id')
  public async updateById(
    @requestParam('id') id: number,
    @requestBody() referral: Referral
  ) {
    await this.referralService.update(id, referral)
    this.socketService.send(ReferralEvent.REFERRAL_UPDATE, referral)
  }
}
