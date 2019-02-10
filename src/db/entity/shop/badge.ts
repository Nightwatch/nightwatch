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
  public readonly categories: ReadonlyArray<BadgeCategory>

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

  @OneToMany(_ => BadgeTag, tag => tag.badge)
  public readonly tags: ReadonlyArray<BadgeTag>

  @Column('timestamp without time zone')
  @IsDate()
  public readonly timestamp: Date

  @Column()
  @IsFQDN()
  @Index({ unique: true })
  public readonly url: string
}
