import { IsDate, IsFQDN, IsNumber } from 'class-validator'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { Guild, ReferralRole, ReferralUnlockedReward, User } from '..'

@Entity()
export class Referral {
  /**
   * The date the referral was created.
   *
   * @type {Date}
   * @memberof Referral
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The Guild the referral belongs to.
   *
   * @type {Guild}
   * @memberof Referral
   */
  @ManyToOne(_ => Guild)
  public guild: Guild
  /**
   * Referral ID. Not auto-generated. Should be generated in the implementation. Ideally, it should only be 4-6 digits long.
   *
   * @type {number}
   * @memberof Referral
   */
  @PrimaryColumn()
  public id: number

  /**
   * Discord invite link.
   *
   * @type {string}
   * @memberof Referral
   */
  @Column('varchar')
  @IsFQDN()
  public inviteUrl: string

  /**
   * Number of times people joined using the referral link.
   *
   * @type {number}
   * @memberof Referral
   */
  @Column()
  @IsNumber()
  public joinCount: number

  /**
   * The role that is given to each user that joins via the referral link.
   *
   * @type {ReferralRole}
   * @memberof Referral
   */
  @OneToOne(_ => ReferralRole, referralRole => referralRole.referral, {
    cascade: true
  })
  public role: ReferralRole

  @OneToMany(
    _ => ReferralUnlockedReward,
    unlockedReward => unlockedReward.referral,
    {
      cascade: true
    }
  )
  public unlockedRewards: ReferralUnlockedReward[]

  /**
   * User that created the referral. They will be known as the referral owner.
   *
   * @type {User}
   * @memberof Referral
   */
  @ManyToOne(_ => User)
  public user: User

  public constructor(referral?: Referral) {
    if (referral) {
      Object.assign(this, referral)
    }

    this.dateCreated = new Date()
  }
}
