import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  OneToOne
} from 'typeorm'
import { Giveaway } from '.'
import { IsFQDN, IsString } from 'class-validator'
import { GiveawayItemKey } from './giveaway-item-key'

@Entity()
export class GiveawayItem {
  /**
   * The ID of the item. Auto-generated.
   *
   * @type {number}
   * @memberof GiveawayItem
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The name of the item. Should be user-friendly.
   *
   * @type {string}
   * @memberof GiveawayItem
   */
  @Column('varchar')
  @IsString()
  name: string

  /**
   * The URL of the item. Should be something like Steam link or store page.
   *
   * @type {string}
   * @memberof GiveawayItem
   */
  @Column('varchar')
  @IsFQDN()
  url: string

  /**
   * The key object of the item.
   *
   * @type {GiveawayItemKey}
   * @memberof GiveawayItem
   */
  @OneToOne(_ => GiveawayItemKey, key => key.giveawayItem, {
    cascade: true
  })
  key: GiveawayItemKey

  /**
   * The giveaway the item is in.
   *
   * @type {Giveaway}
   * @memberof GiveawayItem
   */
  @ManyToOne(_ => Giveaway)
  giveaway: Giveaway
}
