import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne
} from 'typeorm'
import { Guild } from '..'

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @Index()
  @Column()
  userId: string

  @ManyToOne(_ => Guild, guild => guild.playlist)
  guild: Guild
}
