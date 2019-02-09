import { IsDate } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Giveaway } from '.'
import { User } from '..'

@Entity()
export class GiveawayEntry {
  /**
   * The giveaway the user entered.
   *
   * @type {Giveaway}
   * @memberof GiveawayEntry
   */
  @ManyToOne(_ => Giveaway)
  public giveaway: Giveaway
  /**
   * The ID of the entry. Auto-generated.
   *
   * @type {number}
   * @memberof GiveawayEntry
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The date the entry was made.
   *
   * @type {Date}
   * @memberof GiveawayEntry
   */
  @Column()
  @IsDate()
  public timestamp: Date

  /**
   * The user that entered the giveaway.
   *
   * @type {User}
   * @memberof GiveawayEntry
   */
  @ManyToOne(_ => User)
  public user: User

  public constructor() {
    this.timestamp = new Date()
  }
}
