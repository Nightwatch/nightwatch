import { IsDate, IsFQDN, IsNumber, IsString, MaxLength } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { BadgeCategory, BadgeTag } from '.'

@Entity()
export class Badge {
  @OneToMany(_ => BadgeCategory, category => category.badge)
  public categories: BadgeCategory[]

  @Column()
  @IsString()
  @Index({ unique: true })
  public filePath: string
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @IsNumber()
  public likes: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public name: string

  @Column()
  @IsNumber()
  public price: number

  @Column()
  @IsNumber()
  public purchases: number

  @OneToMany(_ => BadgeTag, tag => tag.badge)
  public tags: BadgeTag[]

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date

  @Column()
  @IsFQDN()
  @Index({ unique: true })
  public url: string
}
