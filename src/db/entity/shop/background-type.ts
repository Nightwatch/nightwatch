import { IsString, MaxLength } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Background } from '.'

@Entity()
export class BackgroundType {
  @OneToMany(_ => Background, background => background.type)
  public backgrounds: Background[]

  @Column()
  @IsString()
  public description: string
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public name: string
}
