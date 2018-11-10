import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'
import { IsString, MaxLength, IsDate } from 'class-validator'

@Entity()
export class Category {
  @PrimaryGeneratedColumn() id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  name: string

  @Column()
  @IsString()
  description: string

  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date
}
