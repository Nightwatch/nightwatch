import { IsDate, IsString } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'

@Entity()
export class GuildSupportTicket {
  /**
   * The reason the support ticket was closed, or null
   * if there isn't one.
   *
   * @type {string | null}
   * @memberof GuildSupportTicket
   */
  @Column('varchar', { nullable: true })
  public closedReason: string | null

  /**
   * The ID of the user that closed the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public closedUserId: string

  /**
   * The color of the support ticket, e.g., red for open,
   *  green for closed.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public color: string

  /**
   * The date the support ticket was closed, or null if it hasn't
   * been closed yet.
   *
   * @type {Date | null}
   * @memberof GuildSupportTicket
   */
  @Column('timestamp without time zone', { nullable: true })
  public dateClosed: Date | null

  /**
   * The date the support ticket was created.
   *
   * @type {Date}
   * @memberof GuildSupportTicket
   */
  @Column()
  @IsDate()
  public dateCreated: Date

  /**
   * The description of the support ticket, aka the problem.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public description: string

  /**
   * The guild that the support ticket was created in.
   *
   * @type {Guild}
   * @memberof GuildSupportTicket
   */
  @ManyToOne(_ => Guild, guild => guild.suggestions)
  public guild: Guild
  /**
   * The ID of the support ticket. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSupportTicket
   */
  @PrimaryGeneratedColumn()
  public id: number

  /**
   * The ID of the message containing the ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public messageId: string

  /**
   * The status of the support ticket. Something like:
   *  closed, open, pending, etc.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public status: string

  /**
   * The title of the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public title: string

  /**
   * The type of the support ticket. Practical use case: it may be
   * a bug, or just someone needing help.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public type: string

  /**
   * The ID of the user that opened the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  public userId: string
}
