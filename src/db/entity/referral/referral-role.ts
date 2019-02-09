import { IsNumber } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Referral } from '..'

@Entity()
export class ReferralRole {
  /**
   * The ID of the referral role. Auto-generated.
   *
   * @type {number}
   * @memberof ReferralRole
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The number of members containing the role.
   *
   * @type {number}
   * @memberof ReferralRole
   */
  @Column()
  @IsNumber()
  public members: number

  /**
   * The referral the role is linked to.
   *
   * @type {Referral}
   * @memberof ReferralRole
   */
  @Index({ unique: true })
  @OneToOne(_ => Referral, referral => referral.role)
  @JoinColumn()
  public referral: Referral

  /**
   * The ID of the Discord role. Not auto-generated, should
   * be passed in implementation.
   *
   * @type {string}
   * @memberof ReferralRole
   */
  @Index({ unique: true })
  @Column('varchar')
  public roleId: string
}
