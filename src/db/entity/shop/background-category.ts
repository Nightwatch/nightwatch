import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Background, Category } from '.'

@Index(['background', 'category'], { unique: true })
@Entity()
export class BackgroundCategory {
  @ManyToOne(_ => Background)
  public readonly background: Background

  @ManyToOne(_ => Category)
  public readonly category: Category
  @PrimaryGeneratedColumn()
  public readonly id: number
}
