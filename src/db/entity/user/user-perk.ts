import { User } from '.'
import { Perk } from '..'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm'

@Index(['perk', 'user'], { unique: true })
@Entity()
export class UserPerk {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(_ => Perk)
  perk: Perk

  @ManyToOne(_ => User, user => user.perks)
  user: User
}
