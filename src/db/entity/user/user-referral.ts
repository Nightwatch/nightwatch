import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from '.'
import { Referral } from '..'
import { IsDate } from 'class-validator'

@Entity()
export class UserReferral {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsDate()
  dateUsed: Date

  @ManyToOne(_ => User)
  user: User

  @ManyToOne(_ => Referral)
  referral: Referral

  constructor () {
    this.dateUsed = new Date()
  }
}
