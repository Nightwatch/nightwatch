import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '.'
import { Referral } from '..'

@Entity()
export class UserReferral {
  @Column()
  @IsDate()
  public readonly dateUsed: Date
  @PrimaryGeneratedColumn()
  public readonly id: number

  @ManyToOne(_ => Referral)
  public readonly referral: Referral

  @ManyToOne(_ => User)
  public readonly user: User

  public constructor() {
    this.dateUsed = new Date()
  }
}
