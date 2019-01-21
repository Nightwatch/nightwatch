import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Guild, GuildUserWarning, GuildUserKick, GuildUserBan } from '.'
import { User } from '..'
import { IsString, MaxLength, IsDate } from 'class-validator'

@Entity()
export class GuildUser {
  /**
   * The ID of the guild user. Auto-generated.
   *
   * @type {number}
   * @memberof GuildUser
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The nickname of the user in the guild.
   *
   * @type {string}
   * @memberof GuildUser
   */
  @Column('varchar', { length: 100 })
  @IsString()
  @MaxLength(100)
  nickname: string

  /**
   * The date the user joined the guild, or whenever the bot joined
   * the server if they were there before.
   *
   * @type {Date}
   * @memberof GuildUser
   */
  @Column('timestamp without time zone')
  @IsDate()
  dateJoined: Date

  /**
   * The date the user last sent a message.
   *
   * @type {Date | null}
   * @memberof GuildUser
   */
  @Column('timestamp without time zone', { nullable: true })
  dateLastMessage: Date | null

  /**
   * Every warning the user has had in the guild.
   *
   * @type {GuildUserWarning[]}
   * @memberof GuildUser
   */
  @OneToMany(_ => GuildUserWarning, guildUserWarning => guildUserWarning.user)
  warnings: GuildUserWarning[]

  /**
   * Every kick the user has been issued in the server.
   *
   * @type {GuildUserKick[]}
   * @memberof GuildUser
   */
  @OneToMany(_ => GuildUserKick, guildUserKick => guildUserKick.user)
  kicks: GuildUserKick[]

  /**
   * Every ban the user has been issued in the server.
   *
   * @type {GuildUserBan[]}
   * @memberof GuildUser
   */
  @OneToMany(_ => GuildUserBan, guildUserBan => guildUserBan.user)
  bans: GuildUserBan[]

  /**
   * The GuildUser's global user.
   *
   * @type {User}
   * @memberof GuildUser
   */
  @ManyToOne(_ => User)
  user: User

  /**
   * The guild that the user is in.
   *
   * @type {Guild}
   * @memberof GuildUser
   */
  @ManyToOne(_ => Guild, guild => guild.users)
  guild: Guild

  constructor (guildUser?: GuildUser) {
    if (guildUser) {
      Object.assign(this, guildUser)
    }

    this.dateJoined = new Date()
  }
}
