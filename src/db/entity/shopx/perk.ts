import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne
} from 'typeorm'
import { PerkType } from '.'
import { IsString, MaxLength, IsNumber } from 'class-validator'

@Entity()
export class Perk {
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

  @Column('varchar', { nullable: true })
  duration: string | null

  @ManyToOne(_ => PerkType, perkType => perkType.perks)
  type: PerkType
}
