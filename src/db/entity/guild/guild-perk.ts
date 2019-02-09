import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'
import { Perk } from '..'

@Index(['guild', 'perk'], { unique: true })
@Entity()
export class GuildPerk {
  @ManyToOne(_ => Guild, guild => guild.perks)
  public guild: Guild
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => Perk)
  public perk: Perk
}
