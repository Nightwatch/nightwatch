import { Background, Tag } from '.'
import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

@Index(['background', 'tag'], { unique: true })
@Entity()
export class BackgroundTag {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(_ => Background)
  background: Background

  @ManyToOne(_ => Tag)
  tag: Tag
}
