import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { Guild } from '.'
import { IsBoolean, MaxLength } from 'class-validator'

@Entity()
export class GuildSettings {
  /**
   * The ID of the settings. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSettings
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * Whether or not leveling is enabled in the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  levelsEnabled: boolean

  /**
   * Whether or not the bot will DM users in the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  directMessagesEnabled: boolean

  /**
   * The custom prefix of the guild, or null if there isn't one.
   *
   * @type {string | null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true, length: 32 })
  @MaxLength(32)
  prefix: string | null

  /**
   * The guild the settings apply to.
   *
   * @type {Guild}
   * @memberof GuildSettings
   */
  @Index({ unique: true })
  @OneToOne(_ => Guild, guild => guild.settings)
  @JoinColumn()
  guild: Guild

  constructor () {
    this.levelsEnabled = true
    this.directMessagesEnabled = true
  }
}
