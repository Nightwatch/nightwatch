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
  public readonly description: string
  /**
   * The ID of the reward. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @PrimaryGeneratedColumn() public readonly id: number

  /**
   * The name of the reward.
   *
   * @type {string}
   * @memberof ReferralReward
   */
  @Column('varchar')
  @IsString()
  public readonly name: string

  /**
   * The number of referrals needed to get the reward.
   *
   * @type {number}
   * @memberof ReferralReward
   */
  @Column()
  @IsNumber()
  public readonly referralsNeeded: number
}
