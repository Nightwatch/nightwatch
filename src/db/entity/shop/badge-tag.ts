import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Badge, Tag } from '.'

@Index(['badge', 'tag'], { unique: true })
@Entity()
export class BadgeTag {
  @ManyToOne(_ => Badge)
  public readonly badge: Badge
  @PrimaryGeneratedColumn()
  public readonly id: number

  @ManyToOne(_ => Tag)
  public readonly tag: Tag
}
