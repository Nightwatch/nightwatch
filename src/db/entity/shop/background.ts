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
  public readonly categories: ReadonlyArray<BackgroundCategory>

  @Column()
  @IsString()
  public readonly description: string

  @Column()
  @IsString()
  @Index({ unique: true })
  public readonly filePath: string
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsNumber()
  public readonly likes: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public readonly name: string

  @Column()
  @IsNumber()
  public readonly price: number

  @Column()
  @IsNumber()
  public readonly purchases: number

  @OneToMany(_ => BackgroundTag, tag => tag.background)
  public readonly tags: ReadonlyArray<BackgroundTag>

  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  @ManyToOne(_ => BackgroundType, backgroundType => backgroundType.backgrounds)
  public readonly type: BackgroundType

  @Column()
  @IsFQDN()
  @Index({ unique: true })
  public readonly url: string
}
