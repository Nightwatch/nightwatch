import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne
} from 'typeorm'
import { User } from '.'
import { IsDate } from 'class-validator'

@Index(['user', 'friend'], { unique: true })
@Entity()
export class UserFriend {
  @Column('timestamp without time zone')
  @IsDate()
  dateAdded: Date

  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @ManyToOne(_ => User, user => user.friends)
  user: User

  @Index()
  @ManyToOne(_ => User, user => user.friends)
  friend: User

  constructor (userFriend?: UserFriend) {
    if (userFriend) {
      Object.assign(this, userFriend)
    }

    this.dateAdded = new Date()
  }
}
