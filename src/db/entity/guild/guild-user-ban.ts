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
export class GuildUserBan {
  /**
   * The ID of the guild user ban. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUserBan
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The user that issued the ban.
   *
   * @type {string}
   * @memberof GuildUserBan
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  public readonly issuer: GuildUser

  /**
   * The length of the ban, e.g. `1h`, `1w`, etc.
   *
   * @type {string | null}
   * @memberof GuildUserBan
   */
  @Column('varchar', { nullable: true, length: 10 })
  public readonly length: string | null

  /**
   * The reason the ban was issued.
   *
   * @type {string}
   * @memberof GuildUserBan
   */
  @Column('varchar')
  @IsString()
  public readonly reason: string

  /**
   * The date the ban was issued.
   *
   * @type {Date}
   * @memberof GuildUserBan
   */
  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  /**
   * The guild user that is/was banned.
   *
   * @type {GuildUser}
   * @memberof GuildUserBan
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.bans)
  @JoinColumn()
  public readonly user: GuildUser

  public constructor(guildUserBan?: any) {
    if (guildUserBan) {
      Object.assign(this, guildUserBan)
    }
  }
}
