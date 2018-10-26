import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { User } from '.'
import { IsNumber } from 'class-validator'

@Entity()
export class UserBalance {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNumber()
  netWorth: number

  @Column()
  @IsNumber()
  balance: number

  @Column('timestamp without time zone', { nullable: true })
  dateLastClaimedDailies: Date | null

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.balance, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  constructor() {
    this.netWorth = 0
    this.balance = 0
    this.dateLastClaimedDailies = new Date()
  }
}
