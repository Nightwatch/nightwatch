import { IsDate, IsString } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { GuildUser } from '.'

@Entity()
export class GuildUserKick {
  /**
   * The ID of the guild user kick. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUserKick
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The user that issued the kick.
   *
   * @type {string}
   * @memberof GuildUserKick
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  public issuer: GuildUser

  /**
   * The reason the kick was issued.
   *
   * @type {string}
   * @memberof GuildUserKick
   */
  @Column('varchar')
  @IsString()
  public reason: string

  /**
   * The date the kick was issued.
   *
   * @type {Date}
   * @memberof GuildUserKick
   */
  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date

  /**
   * The guild user that was kicked.
   *
   * @type {GuildUser}
   * @memberof GuildUserKick
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.kicks)
  @JoinColumn()
  public user: GuildUser

  public constructor(guildUserKick?: GuildUserKick) {
    if (guildUserKick) {
      Object.assign(this, guildUserKick)
    }
  }
}
