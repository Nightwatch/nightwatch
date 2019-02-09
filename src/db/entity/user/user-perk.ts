import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '.'
import { Perk } from '..'

@Index(['perk', 'user'], { unique: true })
@Entity()
export class UserPerk {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => Perk)
  public perk: Perk

  @ManyToOne(_ => User, user => user.perks)
  public user: User
}
