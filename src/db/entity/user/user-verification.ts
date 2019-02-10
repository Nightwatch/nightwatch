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
export class UserVerification {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.verification, { onDelete: 'CASCADE' })
  @JoinColumn()
  public readonly user: User

  @Column('varchar', { nullable: true })
  public readonly verificationToken: string

  @Column()
  @IsBoolean()
  public readonly verified: boolean

  public constructor() {
    this.verified = false
  }
}
