import { IsDate, IsString, MaxLength } from 'class-validator'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { Guild, GuildUserBan, GuildUserKick, GuildUserWarning, GuildUserMessage } from '.'
import { User } from '..'

@Entity()
export class GuildUser {
  /**
   * Every ban the user has been issued in the server.
   */
  @OneToMany(_ => GuildUserBan, guildUserBan => guildUserBan.user, {cascade: ['remove']})
  public bans?: ReadonlyArray<GuildUserBan>

  /**
   * The date the user joined the guild, or whenever the bot joined
   * the server if they were there before.
   */
  @Column('timestamp without time zone')
  @IsDate()
  public dateJoined: Date

  /**
   * The date the user last sent a message.
   */
  @Column('timestamp without time zone', { nullable: true })
  public dateLastMessage: Date | null

  /**
   * The guild that the user is in.
   */
  @ManyToOne(_ => Guild, guild => guild.users)
  public guild?: Guild

  /**
   * The ID of the guild user.
   */
   @PrimaryColumn()
   @IsString()
   public id: string

  /**
   * Every kick the user has been issued in the server.
   */
  @OneToMany(_ => GuildUserKick, guildUserKick => guildUserKick.user, {cascade: ['remove']})
  public kicks?: ReadonlyArray<GuildUserKick>

  /**
   * The nickname of the user in the guild.
   */
  @Column('varchar', { length: 100 })
  @IsString()
  @MaxLength(100)
  public nickname: string

  /**
   * The GuildUser's global user.
   */
  @ManyToOne(_ => User)
  public user?: User

  /**
   * Every warning the user has had in the guild.
   */
  @OneToMany(_ => GuildUserWarning, guildUserWarning => guildUserWarning.user, {cascade: ['remove']})
  public warnings?: ReadonlyArray<GuildUserWarning>

  /**
   * Every message the user has sent in the guild.
   */
   @OneToMany(_ => GuildUserMessage, messages => messages.user)
   public messages?: ReadonlyArray<GuildUserMessage>

  public constructor(guildUser?: GuildUser) {
    if (guildUser) {
      Object.assign(this, guildUser)
    }

    this.dateJoined = new Date()
  }
}
