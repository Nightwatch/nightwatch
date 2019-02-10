import { Background, Tag } from '.'
import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

@Index(['background', 'tag'], { unique: true })
@Entity()
export class BackgroundTag {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @ManyToOne(_ => Background)
  public readonly background: Background

  @ManyToOne(_ => Tag)
  public readonly tag: Tag
}
