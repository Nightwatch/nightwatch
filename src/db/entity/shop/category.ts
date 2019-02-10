import { IsDate, IsString, MaxLength } from 'class-validator'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @Column()
  @IsString()
  public readonly description: string
  @PrimaryGeneratedColumn() public readonly id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public readonly name: string

  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date
}
