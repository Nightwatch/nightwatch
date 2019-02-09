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
  public id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public name: string

  @Column()
  @IsString()
  public description: string

  @Column()
  @IsNumber()
  public price: number

  @Column('varchar', { nullable: true })
  public duration: string | null

  @ManyToOne(_ => PerkType, perkType => perkType.perks)
  public type: PerkType
}
