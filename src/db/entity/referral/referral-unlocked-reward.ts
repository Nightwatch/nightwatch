import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Referral, ReferralReward } from '..'

@Entity()
export class ReferralUnlockedReward {
  /**
   * The date that the reward was unlocked.
   *
   * @type {Date}
   * @memberof ReferralUnlockedReward
   */
  @Column()
  @IsDate()
  public dateUnlocked: Date
  /**
   * The ID of the unlocked reward. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralUnlockedReward
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The referral that unlocked the reward for the user.
   *
   * @type {Referral}
   * @memberof ReferralUnlockedReward
   */
  @ManyToOne(_ => Referral, referral => referral.unlockedRewards)
  public referral: Referral

  /**
   * The reward that the user's referral unlocked.
   *
   * @type {ReferralReward}
   * @memberof ReferralUnlockedReward
   */
  @ManyToOne(_ => ReferralReward)
  public reward: ReferralReward
}
