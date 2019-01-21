import { Badge, Tag } from '.'
import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

@Index(['badge', 'tag'], { unique: true })
@Entity()
export class BadgeTag {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(_ => Badge)
  badge: Badge

  @ManyToOne(_ => Tag)
  tag: Tag
}
