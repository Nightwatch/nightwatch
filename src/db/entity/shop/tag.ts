import { IsDate, IsString } from 'class-validator'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn() public readonly id: number

  @Column()
  @IsString()
  @Index({ unique: true })
  public readonly name: string

  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date
}
