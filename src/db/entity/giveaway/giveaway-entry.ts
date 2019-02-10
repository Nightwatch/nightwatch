import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Giveaway } from '.'
import { User } from '..'

@Entity()
export class GiveawayEntry {
  /**
   * The giveaway the user entered.
   */
  @ManyToOne(_ => Giveaway)
  public giveaway: Giveaway
  /**
   * The ID of the entry. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The date the entry was made.
   */
  @Column()
  @IsDate()
  public timestamp: Date

  /**
   * The user that entered the giveaway.
   */
  @ManyToOne(_ => User)
  public user: User

  public constructor() {
    this.timestamp = new Date()
  }
}
