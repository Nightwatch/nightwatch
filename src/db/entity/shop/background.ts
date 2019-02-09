import { IsDate, IsFQDN, IsNumber, IsString, MaxLength } from 'class-validator'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { BackgroundCategory, BackgroundTag, BackgroundType } from '.'

@Entity()
export class Background {
  @OneToMany(_ => BackgroundCategory, category => category.background)
  public categories: BackgroundCategory[]

  @Column()
  @IsString()
  public description: string

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

  @OneToMany(_ => BackgroundTag, tag => tag.background)
  public tags: BackgroundTag[]

  @Column('timestamp without time zone')
  @IsDate()
  public timestamp: Date

  @ManyToOne(_ => BackgroundType, backgroundType => backgroundType.backgrounds)
  public type: BackgroundType

  @Column()
  @IsFQDN()
  @Index({ unique: true })
  public url: string
}
