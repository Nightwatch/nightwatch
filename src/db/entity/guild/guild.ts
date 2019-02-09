import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import {
  GuildPerk,
  GuildSelfAssignableRole,
  GuildSettings,
  GuildSuggestion,
  GuildSupportTicket,
  GuildUser
} from '.'
import { Song } from '../music'

@Entity()
export class Guild {
  /**
   * The date the guild was created.
   *
   * @type {Date}
   * @memberof Guild
   */
  @Column()
  @IsDate()
  public dateCreated: Date
  /**
   * The ID of the guild. Auto-generated.
   *
   * @type {string}
   * @memberof Guild
   */
  @PrimaryColumn()
  @IsString()
  @IsNotEmpty()
  public id: string

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
  public name: string

  @OneToMany(_ => GuildPerk, guildPerk => guildPerk.guild)
  public perks: GuildPerk[]

  @OneToMany(_ => Song, song => song.guild)
  public playlist: Song[]

  @OneToMany(_ => GuildSelfAssignableRole, sar => sar.guild)
  public selfAssignableRoles: GuildSelfAssignableRole[]

  /**
   * The guild's settings.
   *
   * @type {GuildSettings}
   * @memberof Guild
   */
  @OneToOne(_ => GuildSettings, guildSettings => guildSettings.guild, {
    cascade: true
  })
  public settings: GuildSettings

  /**
   * Every suggestion in the guild.
   *
   * @type {GuildSuggestion[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildSuggestion, guildSuggestion => guildSuggestion.guild)
  public suggestions: GuildSuggestion[]

  /**
   * Every support ticket in the guild.
   *
   * @type {GuildSupportTicket[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildSupportTicket, supportTicket => supportTicket.guild)
  public supportTickets: GuildSupportTicket[]

  /**
   * Every user in the guild.
   *
   * @type {GuildUser[]}
   * @memberof Guild
   */
  @OneToMany(_ => GuildUser, guildUser => guildUser.guild)
  public users: GuildUser[]

  public constructor(guild?: Guild) {
    if (guild) {
      Object.assign(this, guild)
    }
    this.dateCreated = new Date()
  }
}
