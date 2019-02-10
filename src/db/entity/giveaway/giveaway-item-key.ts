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
   */
  @OneToOne(_ => Giveaway)
  @JoinColumn()
  public giveaway: Giveaway

  /**
   * The item that the key is for.
   */
  @OneToOne(_ => GiveawayItem, item => item.giveaway)
  @JoinColumn()
  public giveawayItem: GiveawayItem
  /**
   * The ID of the GiveawayItemKey object. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The key of the item. Should be a redeemable key for the item.
   */
  @Index({ unique: true })
  @Column('varchar')
  @IsString()
  public key: string
}
