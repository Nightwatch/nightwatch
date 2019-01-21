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
export class GuildUserWarning {
  /**
   * The ID of the guild user warning. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUserWarning
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The date the warning was issued.
   *
   * @type {Date}
   * @memberof GuildUserWarning
   */
  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  /**
   * The reason the warning was issued.
   *
   * @type {string}
   * @memberof GuildUserWarning
   */
  @Column('varchar')
  @IsString()
  reason: string

  /**
   * The user that issued the warning.
   *
   * @type {string}
   * @memberof GuildUserWarning
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  issuer: GuildUser

  /**
   * The guild user that was warned.
   *
   * @type {GuildUser}
   * @memberof GuildUserWarning
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.warnings)
  @JoinColumn()
  user: GuildUser

  constructor (guildUserWarning?: GuildUserWarning) {
    if (guildUserWarning) {
      Object.assign(this, guildUserWarning)
    }
  }
}
