import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  Index,
  JoinColumn
} from 'typeorm'
import { Guild } from '.'
import { IsString } from 'class-validator'

@Entity()
export class GuildSelfAssignableRole {
  /**
   * The ID of the self assignable role. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSelfAssignableRole
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The ID of the Discord role role.
   *
   * @type {string}
   * @memberof GuildSelfAssignableRole
   */
  @Column()
  @IsString()
  roleId: string

  /**
   * The guild the self assignable roles belong to.
   *
   * @type {Guild}
   * @memberof GuildSelfAssignableRole
   */
  @ManyToOne(_ => Guild, guild => guild.selfAssignableRoles)
  @JoinColumn()
  guild: Guild
}
