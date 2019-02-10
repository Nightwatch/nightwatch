import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Referral, ReferralReward } from '..'

@Entity()
export class ReferralUnlockedReward {
  /**
   * The date that the reward was unlocked.
   */
  @Column()
  @IsDate()
  public readonly dateUnlocked: Date
  /**
   * The ID of the unlocked reward. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The referral that unlocked the reward for the user.
   */
  @ManyToOne(_ => Referral, referral => referral.unlockedRewards)
  public readonly referral: Referral

  /**
   * The reward that the user's referral unlocked.
   */
  @ManyToOne(_ => ReferralReward)
  public readonly reward: ReferralReward
}
