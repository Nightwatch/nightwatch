import { IsDate } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'

@Entity()
@Index(['sender', 'receiver'], { unique: true })
export class UserFriendRequest {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Index()
  @ManyToOne(_ => User, user => user.incomingFriendRequests)
  public receiver: User

  @Index()
  @ManyToOne(_ => User, user => user.outgoingFriendRequests)
  public sender: User

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date

  public constructor(userFriendRequest?: UserFriendRequest) {
    if (userFriendRequest) {
      Object.assign(this, userFriendRequest)
    }

    this.timestamp = new Date()
  }
}
