import { User } from '.'
import { Badge } from '..'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index
} from 'typeorm'
import { IsDate, IsNumber } from 'class-validator'

@Index(['x', 'y', 'user'], { unique: true })
@Entity()
export class UserBadge {
  @PrimaryGeneratedColumn()
  id: number

  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  @Column()
  @IsNumber()
  x: number

  @Column()
  @IsNumber()
  y: number

  @ManyToOne(_ => User)
  user: User

  @ManyToOne(_ => Badge)
  badge: Badge
}
