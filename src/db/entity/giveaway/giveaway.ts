import { IsBoolean, IsDate } from 'class-validator'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { GiveawayItem } from '.'
import { Guild, User } from '..'

@Entity()
export class Giveaway {
  /**
   * Whether or not the giveaway is active.
   */
  @Column()
  @IsBoolean()
  public active: boolean

  /**
   * The date the giveaway was created.
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The date of the end of the giveaway.
   */
  @Column()
  @IsDate()
  public dateEnd: Date

  /**
   * The date of the start of the giveaway.
   */
  @Column()
  @IsDate()
  public dateStart: Date

  /**
   * The guild the giveaway is in. If null, it is in every guild.
   */
  @ManyToOne(_ => Guild)
  public readonly guild: Guild | null
  /**
   * The ID of the giveaway. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The items in the giveaway.
   */
  @OneToMany(_ => GiveawayItem, item => item.giveaway, {
    cascade: true
  })
  public readonly items: ReadonlyArray<GiveawayItem>

  /**
   * The owner of the giveaway.
   */
  @ManyToOne(_ => User)
  public readonly owner: User

  // /**
  //  * The entries into the giveaway.
  //  */
  // @OneToMany(_ => GiveawayEntry, entry => entry.giveaway, {
  //   cascade: true
  // })
  // entries: GiveawayEntry[]

  public constructor() {
    this.guild = null
    this.dateCreated = new Date()
  }
}
