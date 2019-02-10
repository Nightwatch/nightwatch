import { IsDate } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'

@Index(['user', 'friend'], { unique: true })
@Entity()
export class UserFriend {
  @Column('timestamp without time zone')
  @IsDate()
  public dateAdded: Date

  @Index()
  @ManyToOne(_ => User, user => user.friends)
  public friend: User

  @PrimaryGeneratedColumn()
  public readonly id: number

  @Index()
  @ManyToOne(_ => User, user => user.friends)
  public user: User

  public constructor(userFriend?: UserFriend) {
    if (userFriend) {
      Object.assign(this, userFriend)
    }

    this.dateAdded = new Date()
  }
}
