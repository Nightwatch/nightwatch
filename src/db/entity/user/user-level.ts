import { IsDate, IsNumber } from 'class-validator'
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
export class UserLevel {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsNumber()
  public level: number

  @Column()
  @IsDate()
  public timestamp: Date

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.level, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User

  @Column()
  @IsNumber()
  public xp: number

  public constructor() {
    this.xp = 0
    this.level = 0
    this.timestamp = new Date()
  }
}
