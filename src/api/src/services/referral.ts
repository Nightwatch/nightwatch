import { Referral } from '../../../db'
import { getRepository } from 'typeorm'
import { injectable } from 'inversify'
import { ReferralService as IReferralService } from '../interfaces'

/**
 * Referral service to handle referral logic
 */
@injectable()
export class ReferralService implements IReferralService {
  private readonly referralRepository = getRepository(Referral)

  public find() {
    return this.referralRepository.find()
  }

  public async findById(id: number) {
    return this.referralRepository.findOne(id, {
      relations: ['user', 'guild']
    })
  }

  public async create(referral: Referral) {
    return this.referralRepository.save(referral)
  }

  public async update(_: number, referral: Referral) {
    return this.referralRepository.save(referral)
  }

  public async delete(id: number) {
    const referral = await this.referralRepository.findOne(id)

    if (!referral) {
      return
    }

    await this.referralRepository.remove(referral)
  }
}
