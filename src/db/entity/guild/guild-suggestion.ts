import { IsDate, IsNumber, IsString } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'

@Entity()
export class GuildSuggestion {
  /**
   * The color of the suggestion. A practical use would be for the status
   * of the suggestion.
   */
  @Column('varchar')
  @IsString()
  public color: string

  /**
   * The date that the suggestion was created.
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The description of the suggestion, a.k.a the suggestion.
   */
  @Column('varchar')
  @IsString()
  public description: string

  /**
   * The amount of dislikes/thumbs down the suggestion has received.
   */
  @Column()
  @IsNumber()
  public dislikes: number

  /**
   * The guild that the suggestion was created in.
   */
  @ManyToOne(_ => Guild, guild => guild.suggestions)
  public guild: Guild
  /**
   * The ID of the suggestion. Auto-generated.
   */
  @PrimaryGeneratedColumn()
  public readonly id: number

  /**
   * The amount of likes/thumbs up the suggestion has received.
   */
  @Column()
  @IsNumber()
  public likes: number

  /**
   * The ID of the suggestion message sent by the bot.
   */
  @Column('varchar')
  @IsString()
  public messageId: string

  /**
   * The ID of the user that made the suggestion.
   */
  @Column('varchar')
  @IsString()
  public userId: string
}
