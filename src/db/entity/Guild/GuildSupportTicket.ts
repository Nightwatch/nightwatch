import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Guild } from '.'
import { IsString, IsDate } from 'class-validator'

@Entity()
export class GuildSupportTicket {
  /**
   * The ID of the support ticket. Auto-generated.
   *
   * @type {number}
   * @memberof GuildSupportTicket
   */
  @PrimaryGeneratedColumn()
  id: number

  /**
   * The ID of the message containing the ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  messageId: string

  /**
   * The type of the support ticket. Practical use case: it may be
   * a bug, or just someone needing help.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  type: string

  /**
   * The description of the support ticket, aka the problem.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  description: string

  /**
   * The status of the support ticket. Something like:
   *  closed, open, pending, etc.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  status: string

  /**
   * The date the support ticket was closed, or null if it hasn't
   * been closed yet.
   *
   * @type {Date | null}
   * @memberof GuildSupportTicket
   */
  @Column('timestamp without time zone', { nullable: true })
  dateClosed: Date | null

  /**
   * The date the support ticket was created.
   *
   * @type {Date}
   * @memberof GuildSupportTicket
   */
  @Column()
  @IsDate()
  dateCreated: Date

  /**
   * The color of the support ticket, e.g., red for open,
   *  green for closed.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  color: string

  /**
   * The title of the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  title: string

  /**
   * The ID of the user that opened the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  userId: string

  /**
   * The ID of the user that closed the support ticket.
   *
   * @type {string}
   * @memberof GuildSupportTicket
   */
  @Column('varchar')
  @IsString()
  closedUserId: string

  /**
   * The reason the support ticket was closed, or null
   * if there isn't one.
   *
   * @type {string | null}
   * @memberof GuildSupportTicket
   */
  @Column('varchar', { nullable: true })
  closedReason: string | null

  /**
   * The guild that the support ticket was created in.
   *
   * @type {Guild}
   * @memberof GuildSupportTicket
   */
  @ManyToOne(_ => Guild, guild => guild.suggestions)
  guild: Guild
}
