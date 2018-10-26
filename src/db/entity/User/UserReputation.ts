import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'
import { IsNumber } from 'class-validator'

@Entity()
export class UserReputation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNumber()
  reputation: number

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.reputation, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  constructor() {
    this.reputation = 0
  }
}
