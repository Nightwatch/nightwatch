import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  OneToMany
} from 'typeorm'
import { IsNumber, IsFQDN, IsString, MaxLength, IsDate } from 'class-validator'
import { BackgroundType, BackgroundCategory, BackgroundTag } from '.'

@Entity()
export class Background {
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

  @ManyToOne(_ => BackgroundType, backgroundType => backgroundType.backgrounds)
  type: BackgroundType

  @OneToMany(_ => BackgroundCategory, category => category.background)
  categories: BackgroundCategory[]

  @OneToMany(_ => BackgroundTag, tag => tag.background)
  tags: BackgroundTag[]
}
