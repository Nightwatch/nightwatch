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
export class UserReputation {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsNumber()
  public readonly reputation: number

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.reputation, { onDelete: 'CASCADE' })
  @JoinColumn()
  public readonly user: User

  public constructor() {
    this.reputation = 0
  }
}
