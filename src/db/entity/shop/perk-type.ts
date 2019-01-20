import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index
} from 'typeorm'
import { Perk } from '.'
import { IsString, MaxLength } from 'class-validator'

@Entity()
export class PerkType {
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

  @OneToMany(_ => Perk, perk => perk.type)
  perks: Perk[]
}
