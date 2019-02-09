import { IsDate, IsString } from 'class-validator'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn() public id: number

  @Column()
  @IsString()
  @Index({ unique: true })
  public name: string

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date
}
