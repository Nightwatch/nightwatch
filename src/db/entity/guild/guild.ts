import { Entity, PrimaryColumn, Column, OneToOne, OneToMany } from 'typeorm'
import {
  GuildSettings,
  GuildSuggestion,
  GuildSupportTicket,
  GuildUser,
  GuildPerk,
  GuildSelfAssignableRole
} from '.'
import { IsString, MaxLength, IsDate, IsNotEmpty } from 'class-validator'

@Entity()
export class Guild {
  /**
   * The ID of the guild. Auto-generated.
   *
   * @type {string}
   * @memberof Guild
   */
  @PrimaryColumn()
  @IsString()
  @IsNotEmpty()
  id: string

  /**
   * The name of the guild. Maximum length of 100 characters.
   *
   * @type {string}
   * @memberof Guild
   */
  @Column('varchar', { length: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  /**
   * The date the guild was created.
   *
   * @type {Date}
   * @memberof Guild
   */
  @Column()
  @IsDate()
  dateCreated: Date

  /**
   * The guild's settings.
   *
   * @type {GuildSettings}
   * @memberof Guild
   */
  @OneToOne(_ => GuildSettings, guildSettings => guildSettings.guild, {
    cascade: true
  })
  settings: GuildSettings

  /**
   * Every suggestion in the guild.
   *
   * @type {GuildSuggestion[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildSuggestion, guildSuggestion => guildSuggestion.guild)
  suggestions: GuildSuggestion[]

  /**
   * Every support ticket in the guild.
   *
   * @type {GuildSupportTicket[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildSupportTicket, supportTicket => supportTicket.guild)
  supportTickets: GuildSupportTicket[]

  /**
   * Every user in the guild.
   *
   * @type {GuildUser[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildUser, guildUser => guildUser.guild)
  users: GuildUser[]

  @OneToMany(_ => GuildPerk, guildPerk => guildPerk.guild)
  perks: GuildPerk[]

  @OneToMany(_ => GuildSelfAssignableRole, sar => sar.guild)
  selfAssignableRoles: GuildSelfAssignableRole[]

  constructor(guild?: Guild) {
    if (guild) {
      Object.assign(this, guild)
    }
    this.dateCreated = new Date()
  }
}
