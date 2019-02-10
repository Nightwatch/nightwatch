import {
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Giveaway, User } from '..'

export class GiveawayWinner {
  /**
   * The giveaway that the user won.
   *
   * @type {Giveaway}
   * @memberof GiveawayWinner
   */
  @Index({ unique: true })
  @OneToOne(_ => Giveaway)
  @JoinColumn()
  public readonly giveaway: Giveaway
  /**
   * The ID of the GiveawayWinner object. Auto-generated.
   *
   * @type {number}
   * @memberof GiveawayWinner
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The user that won the giveaway.
   *
   * @type {User}
   * @memberof GiveawayWinner
   */
  @ManyToOne(_ => User)
  public readonly user: User
}
