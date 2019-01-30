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
   * Display welcome message when user joins the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  welcomeMessagesEnabled: boolean

  /**
   * Display leave messages when a user leaves the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  leaveMessagesEnabled: boolean

  /**
   * Custom welcome message to display if welcome messages are enabled.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  welcomeMessage: string | null

  /**
   * Custom leave message to display if leave messages are enabled.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  leaveMessage: string | null

  /**
   * Channel to send the welcome/leave message to.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  joinLeaveNotificationChannelId: string | null

  /**
   * Auto assign a role when a user joins the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  autoAssignRole: boolean

  /**
   * The role to auto assign a user if auto assign roles is enabled.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  autoAssignRoleId: string | null

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

  constructor() {
    this.levelsEnabled = true
    this.directMessagesEnabled = true
    this.autoAssignRole = false
    this.autoAssignRoleId = null
    this.joinLeaveNotificationChannelId = null
    this.leaveMessage = null
    this.leaveMessagesEnabled = true
    this.welcomeMessage = null
    this.welcomeMessagesEnabled = true
  }
}
