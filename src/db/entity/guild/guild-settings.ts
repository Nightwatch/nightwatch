import { IsBoolean, MaxLength } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Guild } from '.'

@Entity()
export class GuildSettings {
  /**
   * Auto assign a role when a user joins the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  public autoAssignRole: boolean

  /**
   * The role to auto assign a user if auto assign roles is enabled.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  public autoAssignRoleId: string | null

  /**
   * Whether or not the bot will DM users in the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  public directMessagesEnabled: boolean

  /**
   * The guild the settings apply to.
   *
   * @type {Guild}
   * @memberof GuildSettings
   */
  @Index({ unique: true })
  @OneToOne(_ => Guild, guild => guild.settings)
  @JoinColumn()
  public guild: Guild
  /**
   * The ID of the settings. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSettings
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * Channel to send the welcome/leave message to.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  public joinLeaveNotificationChannelId: string | null

  /**
   * Custom leave message to display if leave messages are enabled.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  public leaveMessage: string | null

  /**
   * Display leave messages when a user leaves the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  public leaveMessagesEnabled: boolean

  /**
   * Whether or not leveling is enabled in the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  public levelsEnabled: boolean

  /**
   * The custom prefix of the guild, or null if there isn't one.
   *
   * @type {string | null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true, length: 32 })
  @MaxLength(32)
  public prefix: string | null

  /**
   * Custom welcome message to display if welcome messages are enabled.
   *
   * @type {string|null}
   * @memberof GuildSettings
   */
  @Column('varchar', { nullable: true })
  public welcomeMessage: string | null

  /**
   * Display welcome message when user joins the guild.
   *
   * @type {boolean}
   * @memberof GuildSettings
   */
  @Column()
  @IsBoolean()
  public welcomeMessagesEnabled: boolean

  public constructor() {
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
