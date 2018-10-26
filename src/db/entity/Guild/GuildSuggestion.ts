import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'
import { IsString, IsDate, IsNumber } from 'class-validator'

@Entity()
export class GuildSuggestion {
  /**
   * The ID of the suggestion. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The color of the suggestion. A practical use would be for the status
   * of the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  color: string

  /**
   * The description of the suggestion, a.k.a the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  description: string

  /**
   * The ID of the suggestion message sent by the bot.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  messageId: string

  /**
   * The ID of the user that made the suggestion.
   *
   * @type {string}
   * @memberof GuildSuggestion
   */
  @Column('varchar')
  @IsString()
  userId: string

  /**
   * The date that the suggestion was created.
   *
   * @type {Date}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsDate()
  dateCreated: Date

  /**
   * The amount of likes/thumbs up the suggestion has received.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsNumber()
  likes: number

  /**
   * The amount of dislikes/thumbs down the suggestion has received.
   *
   * @type {number}
   * @memberof GuildSuggestion
   */
  @Column()
  @IsNumber()
  dislikes: number

  /**
   * The guild that the suggestion was created in.
   *
   * @type {Guild}
   * @memberof GuildSuggestion
   */
  @ManyToOne(_ => Guild, guild => guild.suggestions)
  guild: Guild
}
