import { IsString } from 'class-validator'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Guild } from '.'

@Entity()
export class GuildSelfAssignableRole {
  /**
   * The guild the self assignable roles belong to.
   */
  @ManyToOne(_ => Guild, guild => guild.selfAssignableRoles)
  @JoinColumn()
  public guild: Guild
  /**
   * The ID of the self assignable role. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The ID of the Discord role role.
   */
  @Column()
  @IsString()
  public roleId: string
}
