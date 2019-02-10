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
   */
  @Column()
  public readonly autoAssignRole: boolean

  /**
   * The role to auto assign a user if auto assign roles is enabled.
   */
  @Column('varchar', { nullable: true })
  public readonly autoAssignRoleId: string | null

  /**
   * Whether or not the bot will DM users in the guild.
   */
  @Column()
  @IsBoolean()
  public readonly directMessagesEnabled: boolean

  /**
   * The guild the settings apply to.
   */
  @Index({ unique: true })
  @OneToOne(_ => Guild, guild => guild.settings)
  @JoinColumn()
  public readonly guild: Guild
  /**
   * The ID of the settings. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * Channel to send the welcome/leave message to.
   */
  @Column('varchar', { nullable: true })
  public readonly joinLeaveNotificationChannelId: string | null

  /**
   * Custom leave message to display if leave messages are enabled.
   */
  @Column('varchar', { nullable: true })
  public readonly leaveMessage: string | null

  /**
   * Display leave messages when a user leaves the guild.
   */
  @Column()
  @IsBoolean()
  public readonly leaveMessagesEnabled: boolean

  /**
   * Whether or not leveling is enabled in the guild.
   */
  @Column()
  @IsBoolean()
  public readonly levelsEnabled: boolean

  /**
   * The custom prefix of the guild, or null if there isn't one.
   */
  @Column('varchar', { nullable: true, length: 32 })
  @MaxLength(32)
  public readonly prefix: string | null

  /**
   * Custom welcome message to display if welcome messages are enabled.
   */
  @Column('varchar', { nullable: true })
  public readonly welcomeMessage: string | null

  /**
   * Display welcome message when user joins the guild.
   */
  @Column()
  @IsBoolean()
  public readonly welcomeMessagesEnabled: boolean

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
