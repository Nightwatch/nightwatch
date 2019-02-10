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
   */
  @Index({ unique: true })
  @OneToOne(_ => Giveaway)
  @JoinColumn()
  public readonly giveaway: Giveaway
  /**
   * The ID of the GiveawayWinner object. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The user that won the giveaway.
   */
  @ManyToOne(_ => User)
  public readonly user: User
}
