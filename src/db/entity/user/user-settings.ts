import { IsBoolean } from 'class-validator'
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
export class UserSettings {
  @Column()
  @IsBoolean()
  public directMessagesEnabled: boolean
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsBoolean()
  public levelsEnabled: boolean

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User

  public constructor() {
    this.levelsEnabled = true
    this.directMessagesEnabled = true
  }
}
