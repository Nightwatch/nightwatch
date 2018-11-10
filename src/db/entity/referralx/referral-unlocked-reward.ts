import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Referral, ReferralReward } from '..'
import { IsDate } from 'class-validator'

@Entity()
export class ReferralUnlockedReward {
  /**
   * The ID of the unlocked reward. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralUnlockedReward
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The date that the reward was unlocked.
   *
   * @type {Date}
   * @memberof ReferralUnlockedReward
   */
  @Column()
  @IsDate()
  dateUnlocked: Date

  /**
   * The reward that the user's referral unlocked.
   *
   * @type {ReferralReward}
   * @memberof ReferralUnlockedReward
   */
  @ManyToOne(_ => ReferralReward)
  reward: ReferralReward

  /**
   * The referral that unlocked the reward for the user.
   *
   * @type {Referral}
   * @memberof ReferralUnlockedReward
   */
  @ManyToOne(_ => Referral, referral => referral.unlockedRewards)
  referral: Referral
}
