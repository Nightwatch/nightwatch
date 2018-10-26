import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany
} from 'typeorm'
import { IsNumber, IsFQDN, IsString, MaxLength, IsDate } from 'class-validator'
import { BadgeCategory, BadgeTag } from '.'

@Entity()
export class Badge {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  name: string

  @Column()
  @IsNumber()
  price: number

  @Column()
  @IsFQDN()
  @Index({ unique: true })
  url: string

  @Column()
  @IsString()
  @Index({ unique: true })
  filePath: string

  @Column()
  @IsNumber()
  likes: number

  @Column()
  @IsNumber()
  purchases: number

  @Column('timestamp without time zone')
  @IsDate()
  timestamp: Date

  @OneToMany(_ => BadgeCategory, category => category.badge)
  categories: BadgeCategory[]

  @OneToMany(_ => BadgeTag, tag => tag.badge)
  tags: BadgeTag[]
}
