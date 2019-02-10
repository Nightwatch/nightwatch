import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Badge, Category } from '.'

@Index(['badge', 'category'], { unique: true })
@Entity()
export class BadgeCategory {
  @ManyToOne(_ => Badge)
  public readonly badge: Badge

  @ManyToOne(_ => Category)
  public readonly category: Category
  @PrimaryGeneratedColumn()
  public readonly id: number
}
