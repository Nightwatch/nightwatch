import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Badge, Tag } from '.'

@Index(['badge', 'tag'], { unique: true })
@Entity()
export class BadgeTag {
  @ManyToOne(_ => Badge)
  public badge: Badge
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(_ => Tag)
  public tag: Tag
}
