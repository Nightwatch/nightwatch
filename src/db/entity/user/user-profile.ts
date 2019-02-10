import { IsString } from 'class-validator'
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
export class UserProfile {
  @Column('varchar')
  @IsString()
  public background: string

  @Column('varchar')
  @IsString()
  public bio: string
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column('varchar')
  @IsString()
  public title: string

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User

  public constructor() {
    this.title = ''
    this.bio = ''
    this.background = 'default'
  }
}
