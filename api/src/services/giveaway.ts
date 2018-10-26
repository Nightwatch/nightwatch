import { Giveaway } from '../../../db'
import { getRepository } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { injectable } from 'inversify'

/**
 * Giveaway service that handles storing and modifying giveaway data.
 *
 * @class GiveawayService
 */
@injectable()
export class GiveawayService implements BaseService<Giveaway, number> {
  private giveawayRepository = getRepository(Giveaway)

  public getAll () {
    return this.giveawayRepository.find({ relations: ['items'] })
  }

  public async findById (id: number) {
    return this.giveawayRepository.findOne(id, { relations: ['items'] })
  }

  public create (giveaway: Giveaway) {
    giveaway.dateCreated = new Date()
    return this.giveawayRepository.save(giveaway)
  }

  public async update (_: number, giveaway: Giveaway) {
    return this.giveawayRepository.save(giveaway)
  }

  public async delete (id: number) {
    const giveaway = await this.giveawayRepository.findOne(id)

    if (!giveaway) {
      return
    }

    return this.giveawayRepository.remove(giveaway)
  }
}
