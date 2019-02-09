import { IsString } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Giveaway, GiveawayItem } from '.'

@Entity()
export class GiveawayItemKey {
  /**
   * The giveaway that the key is linked to.
   *
   * @type {Giveaway}
   * @memberof GiveawayItemKey
   */
  @OneToOne(_ => Giveaway)
  @JoinColumn()
  public giveaway: Giveaway

  /**
   * The item that the key is for.
   *
   * @type {GiveawayItem}
   * @memberof GiveawayItemKey
   */
  @OneToOne(_ => GiveawayItem, item => item.giveaway)
  @JoinColumn()
  public giveawayItem: GiveawayItem
  /**
   * The ID of the GiveawayItemKey object. Auto-generated.
   *
   * @type {number}
   * @memberof GiveawayItemKey
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The key of the item. Should be a redeemable key for the item.
   *
   * @type {string}
   * @memberof GiveawayItemKey
   */
  @Index({ unique: true })
  @Column('varchar')
  @IsString()
  public key: string
}
