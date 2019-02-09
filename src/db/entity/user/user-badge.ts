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
  public badge: Badge
  @PrimaryGeneratedColumn()
  public id: number

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date

  @ManyToOne(_ => User)
  public user: User

  @Column()
  @IsNumber()
  public x: number

  @Column()
  @IsNumber()
  public y: number
}
