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
   *
   * @type {Guild}
   * @memberof GuildSelfAssignableRole
   */
  @ManyToOne(_ => Guild, guild => guild.selfAssignableRoles)
  @JoinColumn()
  public guild: Guild
  /**
   * The ID of the self assignable role. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSelfAssignableRole
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The ID of the Discord role role.
   *
   * @type {string}
   * @memberof GuildSelfAssignableRole
   */
  @Column()
  @IsString()
  public roleId: string
}
