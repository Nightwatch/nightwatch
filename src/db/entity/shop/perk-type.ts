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
  public readonly id: number

  @Column({ length: 100 })
  @IsString()
  @MaxLength(100)
  @Index({ unique: true })
  public readonly name: string

  @Column()
  @IsString()
  public readonly description: string

  @OneToMany(_ => Perk, perk => perk.type)
  public readonly perks: ReadonlyArray<Perk>
}
