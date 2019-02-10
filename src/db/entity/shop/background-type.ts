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
  public readonly backgrounds: ReadonlyArray<Background>

  @Column()
  @IsString()
  public readonly description: string
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public readonly name: string
}
