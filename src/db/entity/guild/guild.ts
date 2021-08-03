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
import { GuildUserMessage } from './guild-user-message'

@Entity()
export class Guild {
  /**
   * The date the guild was created.
   */
  @Column()
  @IsDate()
  public dateCreated: Date
  /**
   * The ID of the guild. Auto-generated.
   */
  @PrimaryColumn()
  @IsString()
  @IsNotEmpty()
  public id: string

  /**
   * The name of the guild. Maximum length of 100 characters.
   */
  @Column('varchar', { length: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public name: string

  @OneToMany(_ => GuildPerk, guildPerk => guildPerk.guild, {cascade: ['remove']})
  public perks?: ReadonlyArray<GuildPerk>

  @OneToMany(_ => Song, song => song.guild, {cascade: ['remove']})
  public playlist?: ReadonlyArray<Song>

  @OneToMany(_ => GuildSelfAssignableRole, sar => sar.guild, {cascade: ['remove']})
  public selfAssignableRoles?: ReadonlyArray<GuildSelfAssignableRole>

  /**
   * The guild's settings.
   */
  @OneToOne(_ => GuildSettings, guildSettings => guildSettings.guild, {
    cascade: true
  })
  public settings?: GuildSettings

  /**
   * Every suggestion in the guild.
   */
  @OneToMany(_ => GuildSuggestion, guildSuggestion => guildSuggestion.guild, {cascade: ['remove']})
  public suggestions?: ReadonlyArray<GuildSuggestion>

  /**
   * Every support ticket in the guild.
   */
  @OneToMany(_ => GuildSupportTicket, supportTicket => supportTicket.guild, {cascade: ['remove']})
  public supportTickets?: ReadonlyArray<GuildSupportTicket>

  /**
   * Every user in the guild.
   */
  @OneToMany(_ => GuildUser, guildUser => guildUser.guild, {cascade: ['remove']})
  public users?: ReadonlyArray<GuildUser>

  /**
   * Every message in the guild.
   */
   @OneToMany(_ => GuildUserMessage, messages => messages.guild, {cascade: ['remove']})
   public messages?: ReadonlyArray<GuildUserMessage>

  public constructor(guild?: Guild) {
    if (guild) {
      Object.assign(this, guild)
    }
    this.dateCreated = new Date()
  }
}
