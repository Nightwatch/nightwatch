import { IsDate, IsString } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Guild, GuildUser } from '.'

@Entity()
export class GuildUserMessage {
  /**
   * Auto generated ID.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The content of the message.
   */
  @Column('varchar')
  @IsString()
  public readonly content: string

  /**
   * The date of the message.
   */
  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  /**
   * The guild user who sent the message.
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.messages)
  @JoinColumn()
  public readonly user: GuildUser

  /**
   * The guild that the suggestion was created in.
   */
   @ManyToOne(_ => Guild, guild => guild.messages)
   public guild: Guild

  public constructor(message?: GuildUserMessage) {
    if (message) {
      Object.assign(this, message)
    }
  }
}
