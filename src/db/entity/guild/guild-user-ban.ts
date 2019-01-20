import {
  Entity,
  Column,
  JoinColumn,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { GuildUser } from '.'
import { IsDate, IsString } from 'class-validator'

@Entity()
export class GuildUserBan {
  /**
   * The ID of the guild user ban. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUserBan
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The date the ban was issued.
   *
   * @type {Date}
   * @memberof GuildUserBan
   */
  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  /**
   * The reason the ban was issued.
   *
   * @type {string}
   * @memberof GuildUserBan
   */
  @Column('varchar')
  @IsString()
  reason: string

  /**
   * The length of the ban, e.g. `1h`, `1w`, etc.
   *
   * @type {string | null}
   * @memberof GuildUserBan
   */
  @Column('varchar', { nullable: true, length: 10 })
  length: string | null

  /**
   * The user that issued the ban.
   *
   * @type {string}
   * @memberof GuildUserBan
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  issuer: GuildUser

  /**
   * The guild user that is/was banned.
   *
   * @type {GuildUser}
   * @memberof GuildUserBan
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.bans)
  @JoinColumn()
  user: GuildUser

  constructor (guildUserBan?: any) {
    if (guildUserBan) {
      Object.assign(this, guildUserBan)
    }
  }
}
