import { IsDate, IsNumber } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'
import { Badge } from '..'

@Index(['x', 'y', 'user'], { unique: true })
@Entity()
export class UserBadge {
  @ManyToOne(_ => Badge)
  public readonly badge: Badge
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  @ManyToOne(_ => User)
  public readonly user: User

  @Column()
  @IsNumber()
  public readonly x: number

  @Column()
  @IsNumber()
  public readonly y: number
}
