import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne
} from 'typeorm'
import { User } from '.'
import { IsDate } from 'class-validator'

@Entity()
@Index(['sender', 'receiver'], { unique: true })
export class UserFriendRequest {
  @PrimaryGeneratedColumn()
  id: number

  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  @Index()
  @ManyToOne(_ => User, user => user.outgoingFriendRequests)
  sender: User

  @Index()
  @ManyToOne(_ => User, user => user.incomingFriendRequests)
  receiver: User

  constructor(userFriendRequest?: UserFriendRequest) {
    if (userFriendRequest) {
      Object.assign(this, userFriendRequest)
    }

    this.timestamp = new Date()
  }
}
