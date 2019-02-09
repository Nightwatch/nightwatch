import { IsDate, IsNumber, IsString } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'

@Entity()
export class GuildSuggestion {
  /**
   * The color of the suggestion. A practical use would be for the status
   * of the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  public color: string

  /**
   * The date that the suggestion was created.
   *
   * @type {Date}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The description of the suggestion, a.k.a the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  public description: string

  /**
   * The amount of dislikes/thumbs down the suggestion has received.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsNumber()
  public dislikes: number

  /**
   * The guild that the suggestion was created in.
   *
   * @type {Guild}
   * @memberof GuildSuggestion
   */
  @ManyToOne(_ => Guild, guild => guild.suggestions)
  public guild: Guild
  /**
   * The ID of the suggestion. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The amount of likes/thumbs up the suggestion has received.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsNumber()
  public likes: number

  /**
   * The ID of the suggestion message sent by the bot.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  public messageId: string

  /**
   * The ID of the user that made the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  public userId: string
}
