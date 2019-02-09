import { IsNumber, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ReferralReward {
  /**
   * The description of the reward.
   *
   * @type {string}
   * @memberof ReferralReward
   */
  @Column('varchar')
  @IsString()
  public description: string
  /**
   * The ID of the reward. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @PrimaryGeneratedColumn() public id: number

  /**
   * The name of the reward.
   *
   * @type {string}
   * @memberof ReferralReward
   */
  @Column('varchar')
  @IsString()
  public name: string

  /**
   * The number of referrals needed to get the reward.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @Column()
  @IsNumber()
  public referralsNeeded: number
}
