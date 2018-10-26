import { Background, Category } from '.'
import { Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

@Index(['background', 'category'], { unique: true })
@Entity()
export class BackgroundCategory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(_ => Background)
  background: Background

  @ManyToOne(_ => Category)
  category: Category
}
