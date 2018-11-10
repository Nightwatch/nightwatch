import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { IsString, IsNumber } from 'class-validator'

@Entity()
export class ReferralReward {
  /**
   * The ID of the reward. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @PrimaryGeneratedColumn() id: number

  /**
   * The name of the reward.
   *
   * @type {string}
   * @memberof ReferralReward
   */
  @Column('varchar')
  @IsString()
  name: string

  /**
   * The description of the reward.
   *
   * @type {string}
   * @memberof ReferralReward
   */
  @Column('varchar')
  @IsString()
  description: string

  /**
   * The number of referrals needed to get the reward.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @Column()
  @IsNumber()
  referralsNeeded: number
}
