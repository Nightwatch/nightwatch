import { IsNumber } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'

@Entity()
export class UserBalance {
  @Column()
  @IsNumber()
  public balance: number

  @Column('timestamp without time zone', { nullable: true })
  public dateLastClaimedDailies: Date | null
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @IsNumber()
  public netWorth: number

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.balance, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User

  public constructor() {
    this.netWorth = 0
    this.balance = 0
    this.dateLastClaimedDailies = null
  }
}
