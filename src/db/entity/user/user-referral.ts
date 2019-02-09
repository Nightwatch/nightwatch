import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '.'
import { Referral } from '..'

@Entity()
export class UserReferral {
  @Column()
  @IsDate()
  public dateUsed: Date
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => Referral)
  public referral: Referral

  @ManyToOne(_ => User)
  public user: User

  public constructor() {
    this.dateUsed = new Date()
  }
}
