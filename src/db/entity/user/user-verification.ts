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
  public id: number

  @Index({ unique: true })
  @OneToOne(_ => User, user => user.verification, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: User

  @Column('varchar', { nullable: true })
  public verificationToken: string

  @Column()
  @IsBoolean()
  public verified: boolean

  public constructor() {
    this.verified = false
  }
}
