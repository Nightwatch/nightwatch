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
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The number of members containing the role.
   */
  @Column()
  @IsNumber()
  public readonly members: number

  /**
   * The referral the role is linked to.
   */
  @Index({ unique: true })
  @OneToOne(_ => Referral, referral => referral.role)
  @JoinColumn()
  public readonly referral: Referral

  /**
   * The ID of the Discord role. Not auto-generated, should
   * be passed in implementation.
   */
  @Index({ unique: true })
  @Column('varchar')
  public readonly roleId: string
}
