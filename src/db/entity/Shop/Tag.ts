import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'
import { IsDate, IsString } from 'class-validator'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn() id: number

  @Column()
  @IsString()
  @Index({ unique: true })
  name: string

  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date
}
