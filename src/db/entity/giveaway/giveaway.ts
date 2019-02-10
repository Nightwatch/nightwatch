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
   *
   * @type {boolean}
   * @memberof Giveaway
   */
  @Column()
  @IsBoolean()
  public active: boolean

  /**
   * The date the giveaway was created.
   *
   * @type {Date}
   * @memberof Giveaway
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The date of the end of the giveaway.
   *
   * @type {Date}
   * @memberof Giveaway
   */
  @Column()
  @IsDate()
  public dateEnd: Date

  /**
   * The date of the start of the giveaway.
   *
   * @type {Date}
   * @memberof Giveaway
   */
  @Column()
  @IsDate()
  public dateStart: Date

  /**
   * The guild the giveaway is in. If null, it is in every guild.
   *
   * @type {Guild | null}
   * @memberof Giveaway
   */
  @ManyToOne(_ => Guild)
  public readonly guild: Guild | null
  /**
   * The ID of the giveaway. Auto-generated.
   *
   * @type {number}
   * @memberof Giveaway
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The items in the giveaway.
   *
   * @type {GiveawayItem[]}
   * @memberof Giveaway
   */
  @OneToMany(_ => GiveawayItem, item => item.giveaway, {
    cascade: true
  })
  public readonly items: ReadonlyArray<GiveawayItem>

  /**
   * The owner of the giveaway.
   *
   * @type {User}
   * @memberof Giveaway
   */
  @ManyToOne(_ => User)
  public readonly owner: User

  // /**
  //  * The entries into the giveaway.
  //  *
  //  * @type {GiveawayEntry[]}
  //  * @memberof Giveaway
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
