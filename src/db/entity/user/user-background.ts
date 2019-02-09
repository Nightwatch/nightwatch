import { IsDate } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '.'
import { Background } from '..'

@Index(['user', 'background'], { unique: true })
@Entity()
export class UserBackground {
  @ManyToOne(_ => Background)
  public background: Background

  @Column('timestamp without time zone')
  @IsDate()
  public datetime: Date
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => User, user => user.backgrounds)
  public user: User
}
