import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Guild } from '..'

@Entity()
export class Song {
  @ManyToOne(_ => Guild, guild => guild.playlist)
  public guild: Guild

  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  public url: string

  @Index()
  @Column()
  public userId: string
}
