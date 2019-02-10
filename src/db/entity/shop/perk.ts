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
  public readonly id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public readonly name: string

  @Column()
  @IsString()
  public readonly description: string

  @Column()
  @IsNumber()
  public readonly price: number

  @Column('varchar', { nullable: true })
  public readonly duration: string | null

  @ManyToOne(_ => PerkType, perkType => perkType.perks)
  public readonly type: PerkType
}
