import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { User } from '.'
import { IsNumber, IsDate } from 'class-validator'

@Entity()
export class UserLevel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNumber()
  xp: number

  @Column()
  @IsNumber()
  level: number

  @Column()
  @IsDate()
  timestamp: Date

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.level, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  constructor() {
    this.xp = 0
    this.level = 0
    this.timestamp = new Date()
  }
}
