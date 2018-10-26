import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { User } from '.'
import { IsBoolean } from 'class-validator'

@Entity()
export class UserVerification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsBoolean()
  verified: boolean

  @Column('varchar', { nullable: true })
  verificationToken: string

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.verification)
  @JoinColumn()
  user: User

  constructor () {
    this.verified = false
  }
}
