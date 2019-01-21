import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index
} from 'typeorm'
import { IsString, MaxLength } from 'class-validator'
import { Background } from '.'

@Entity()
export class BackgroundType {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  name: string

  @Column()
  @IsString()
  description: string

  @OneToMany(_ => Background, background => background.type)
  backgrounds: Background[]
}
