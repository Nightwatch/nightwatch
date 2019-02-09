import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Background, Category } from '.'

@Index(['background', 'category'], { unique: true })
@Entity()
export class BackgroundCategory {
  @ManyToOne(_ => Background)
  public background: Background

  @ManyToOne(_ => Category)
  public category: Category
  @PrimaryGeneratedColumn()
  public id: number
}
