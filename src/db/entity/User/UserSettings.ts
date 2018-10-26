import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { User } from '.'
import { IsBoolean } from 'class-validator'

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsBoolean()
  levelsEnabled: boolean

  @Column()
  @IsBoolean()
  directMessagesEnabled: boolean

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.settings)
  @JoinColumn()
  user: User

  constructor () {
    this.levelsEnabled = true
    this.directMessagesEnabled = true
  }
}
