import { Background, Tag } from '.'
import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

@Index(['background', 'tag'], { unique: true })
@Entity()
export class BackgroundTag {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => Background)
  public background: Background

  @ManyToOne(_ => Tag)
  public tag: Tag
}
