import { IsDate, IsString } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { GuildUser } from '.'

@Entity()
export class GuildUserWarning {
  /**
   * The ID of the guild user warning. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The user that issued the warning.
   */
  @ManyToOne(_ => GuildUser)
  @JoinColumn()
  public readonly issuer: GuildUser

  /**
   * The reason the warning was issued.
   */
  @Column('varchar')
  @IsString()
  public readonly reason: string

  /**
   * The date the warning was issued.
   */
  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  /**
   * The guild user that was warned.
   */
  @Index({ unique: true })
  @ManyToOne(_ => GuildUser, guildUser => guildUser.warnings)
  @JoinColumn()
  public readonly user: GuildUser

  public constructor(guildUserWarning?: GuildUserWarning) {
    if (guildUserWarning) {
      Object.assign(this, guildUserWarning)
    }
  }
}
