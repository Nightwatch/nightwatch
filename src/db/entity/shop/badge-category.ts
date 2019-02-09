import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Badge, Category } from '.'

@Index(['badge', 'category'], { unique: true })
@Entity()
export class BadgeCategory {
  @ManyToOne(_ => Badge)
  public badge: Badge

  @ManyToOne(_ => Category)
  public category: Category
  @PrimaryGeneratedColumn()
  public id: number
}
