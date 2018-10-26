import {
  Entity,
  JoinColumn,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'
import { GuildUser } from '.'
import { IsDate, IsString } from 'class-validator'

@Entity()
export class GuildUserKick {
  /**
   * The ID of the guild user kick. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUserKick
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The date the kick was issued.
   *
   * @type {Date}
   * @memberof GuildUserKick
   */
  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  /**
   * The reason the kick was issued.
   *
   * @type {string}
   * @memberof GuildUserKick
   */
  @Column('varchar')
  @IsString()
  reason: string

  /**
   * The user that issued the kick.
   *
   * @type {string}
   * @memberof GuildUserKick
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  issuer: GuildUser

  /**
   * The guild user that was kicked.
   *
   * @type {GuildUser}
   * @memberof GuildUserKick
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.kicks)
  @JoinColumn()
  user: GuildUser

  constructor (guildUserKick?: GuildUserKick) {
    if (guildUserKick) {
      Object.assign(this, guildUserKick)
    }
  }
}
