import { IsDate, IsString, MaxLength } from 'class-validator'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @Column()
  @IsString()
  public description: string
  @PrimaryGeneratedColumn() public id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public name: string

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date
}
