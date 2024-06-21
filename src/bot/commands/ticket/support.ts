import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import * as materialColors from 'material-colors'
import { oneLine } from 'common-tags'
import { GuildSupportTicket } from '../../../db'
import { GuildService } from '../../services'
import { Command } from '../../base'
import { Client } from '../../models'

interface SupportTicket {
  readonly color: string
  readonly title: string
  readonly [key: string]: string
}

interface SupportTicketList {
  readonly [key: string]: SupportTicket
}

const types = {
  bug: {
    color: materialColors.red['500'] as string,
    title: 'New Bug Report'
  } as SupportTicket,
  default: {
    color: materialColors.yellow['500'] as string,
    title: 'New Support Ticket'
  } as SupportTicket
} as SupportTicketList

const ticketTypes: ReadonlyArray<any> = ['bug']

export default class SupportCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'support',
      group: 'ticket',
      memberName: 'support',
      description: 'Create a support ticket.',
      details: `Creates/closes a support ticket. The supported actions:
        __support create <description>:__ Creates a support ticket.
        __support create bug <description>:__ Creates a bug ticket.
        __support close <ticket ID> <reason>:__ Closes a ticket.
        __support get <ticket ID>:__ Gets a ticket.
        __support edit <ticket ID> <new description>:__ Updates a ticket.`,
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'action',
          prompt: 'What would you like to do?\n',
          type: 'string',
          default: 'create',
          parse: (str: string) => str.toLowerCase()
        },
        {
          key: 'description',
          prompt: 'What is the issue?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const argsTyped: {
      readonly action: string
      readonly description: string
    } = args

    switch (argsTyped.action.trim().toLowerCase()) {
      case 'create':
        return this.createTicket(msg, argsTyped.description)
      case 'close':
        return this.closeTicket(msg, argsTyped.description)
      case 'get':
        return this.getTicket(msg, argsTyped.description)
      case 'edit':
        return this.editTicket(msg, argsTyped.description)
      default:
        return this.createTicket(
          msg,
          argsTyped.action.charAt(0).toUpperCase() +
            argsTyped.action.substring(1) +
            (argsTyped.description ? ' ' + argsTyped.description : '')
        )
    }
  }

  private async createTicket(msg: CommandoMessage, description: string) {
    const channel = msg.guild.channels.cache.find(x => x.name === 'support' && x.type == 'text')

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find support channel.
          If you are an admin, please create a #support text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id).catch(() => guildService.create(msg.guild))

    if (!guild) {
      return msg.reply('Command failed. Guild does not exist in my database.')
    }

    const embed = new MessageEmbed()

    const ticketType = ticketTypes.find(
      x =>
        description
          .trim()
          .split(' ')[0]
          .toLowerCase() === x
    )

    const ticketDescription = ticketType
      ? description.slice(ticketType.length + 1)
      : description
    const title = ticketType ? types[ticketType].title : types.default.title
    const color = ticketType ? types[ticketType].color : types.default.color

    embed
      .setAuthor(title)
      .setColor(color)
      .addField('Status', 'Open', true)
      .addField('Submitted By', msg.member, true)

    if (ticketType) {
      embed.addField('Type', ticketType.toUpperCase(), true)
    }

    embed.addField('Description', ticketDescription).setTimestamp(new Date())

    const textChannel = channel as TextChannel

    textChannel
      .send(embed)
      .then(async (m: Message | ReadonlyArray<Message>) => {
        const supportTicketMessage = m as Message
        const dbSupportTicket = new GuildSupportTicket()
        dbSupportTicket.description =
          ticketDescription.charAt(0).toUpperCase() +
          ticketDescription.substring(1)
        dbSupportTicket.status = 'Open'
        dbSupportTicket.type = ticketType || 'default'
        dbSupportTicket.userId = msg.member!.id
        dbSupportTicket.messageId = supportTicketMessage.id
        dbSupportTicket.color = color
        dbSupportTicket.title = title
        dbSupportTicket.closedReason = null
        dbSupportTicket.closedUserId = ''
        dbSupportTicket.dateClosed = null
        dbSupportTicket.guild = guild

        const ticket = await guildService.createSupportTicket(
          msg.guild.id,
          dbSupportTicket
        )

        const editedEmbed = new MessageEmbed()

        editedEmbed
          .setAuthor(title)
          .setColor(color)
          .addField('ID', ticket.id, true)
          .addField('Status', 'Open', true)
          .addField('Submitted By', msg.member, true)

        if (ticketType) {
          editedEmbed.addField('Type', ticketType.toUpperCase(), true)
        }

        editedEmbed
          .addField('Description', ticketDescription)
          .setTimestamp(new Date())

        await supportTicketMessage.edit(editedEmbed)
        return undefined
      })
      .catch((err: Error) => {
        console.error(err)
        return msg.channel.send('Error occurred while creating support ticket.')
      })

    return msg.reply(
      `Your support ticket has been created. You may view it in ${channel}`
    )
  }

  private async getTicket(msg: CommandoMessage, description: string) {
    const channel = msg.guild.channels.cache.find(x => x.name === 'support' && x.type == 'text')

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find support channel.
        If you are an admin, please create a #support text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id).catch(() => guildService.create(msg.guild))

    if (!guild) {
      return msg.reply(
        oneLine`This guild does not exist in my database.
          An entry has been created. Please try the command again.`
      )
    }

    const ticketId = description.trim()
    const ticket = guild.supportTickets?.find(x => x.id === Number(ticketId))
    if (!ticket) {
      return msg.reply('Invalid ticketId')
    }

    const embed = new MessageEmbed()

    embed
      .setAuthor(ticket.title)
      .setColor(ticket.color)
      .addField('ID', ticket.id, true)
      .addField(
        'Status',
        ticket.status +
          (ticket.closedReason ? ` (${ticket.closedReason})` : ''),
        true
      )
      .addField(
        'Submitted By',
        msg.guild.members.cache.get(ticket.userId),
        true
      )

    if (ticket.dateClosed) {
      embed.addField(
        'Closed By',
        msg.guild.members.cache.get(ticket.closedUserId),
        true
      )
    }

    if (ticket.type && ticket.type !== 'default') {
      embed.addField('Type', ticket.type.toUpperCase(), true)
    }

    embed
      .addField('Description', ticket.description)
      .setTimestamp(new Date(ticket.dateCreated))

    return (channel as TextChannel).send(embed)
  }

  private async closeTicket(msg: CommandoMessage, description: string) {
    const channel = msg.guild.channels.cache.find(x => x.name === 'support' && x.type == 'text')

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find support channel.
          If you are an admin, please create a #support text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id).catch(() => guildService.create(msg.guild))

    if (!guild) {
      return msg.reply(
        oneLine`This guild does not exist in my database.
          An entry has been created. Please try the command again.`
      )
    }

    const ticketId = Number(description.substring(0, description.indexOf(' ')))
    const ticket = guild.supportTickets?.find(x => x.id === ticketId)

    if (!ticket) {
      return msg.reply('Invalid ticketId')
    }

    const isTicketOwner = msg.member!.id === ticket.userId

    const closedReason = description.substring(description.indexOf(' ')).trim()

    if (!isTicketOwner && !msg.member!.hasPermission('MANAGE_MESSAGES')) {
      return msg.reply("You don't have permission to do that.")
    }

    if (!ticket) {
      return msg.reply('Invalid ticketId')
    }

    ticket.dateClosed = new Date()
    ticket.status = 'Closed'
    ticket.color = materialColors.green['500']
    ticket.title = ticket.type === 'bug' ? 'Bug Report Closed' : 'Ticket Closed'
    ticket.closedReason = closedReason || null
    ticket.closedUserId = msg.member!.id

    const newEmbed = new MessageEmbed()

    newEmbed
      .setAuthor(ticket.title)
      .setColor(ticket.color)
      .addField('ID', ticket.id, true)
      .addField(
        'Status',
        ticket.status +
          (ticket.closedReason ? ` (${ticket.closedReason})` : ''),
        true
      )
      .addField(
        'Submitted By',
        msg.guild.members.cache.get(ticket.userId),
        true
      )
      .addField(
        'Closed By',
        msg.guild.members.cache.get(ticket.closedUserId),
        true
      )

    if (ticket.type && ticket.type !== 'default') {
      newEmbed.addField('Type', ticket.type.toUpperCase(), true)
    }

    newEmbed
      .addField('Description', ticket.description)
      .setTimestamp(new Date(ticket.dateCreated))

    await guildService.updateSupportTicket(msg.guild.id, ticketId, ticket)

    const messages = (channel as TextChannel).messages

    const originalMessage = messages.cache.get(ticket.messageId)

    try {
      await originalMessage?.edit(newEmbed)
    } catch {
      await (channel as TextChannel).send(newEmbed)
    }

    return msg.reply(`Support ticket ${ticket.id} has been closed.`)
  }

  private async editTicket(msg: CommandoMessage, description: string) {
    const channel = msg.guild.channels.cache.find(x => x.name === 'support' && x.type == 'text')

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find support channel.
          If you are an admin, please create a #support text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id).catch(() => guildService.create(msg.guild))

    if (!guild) {
      return msg.reply(
        oneLine`This guild does not exist in my database.
        An entry has been created. Please try the command again.`
      )
    }

    const ticketId = description.substring(0, description.indexOf(' '))
    const ticket = guild.supportTickets?.find(x => x.id === Number(ticketId))

    if (!ticket) {
      return msg.reply(`Ticket ${ticketId} not found.`)
    }

    const isTicketOwner = msg.member!.id === ticket.userId

    const newDescription = description
      .substring(description.indexOf(' '))
      .trim()

    if (!isTicketOwner && !msg.member!.hasPermission('MANAGE_MESSAGES')) {
      return msg.reply("You don't have permission to do that.")
    }

    const messages = (channel as TextChannel).messages

    const originalMessage = messages.cache.get(ticket.messageId)

    if (!originalMessage) {
      return msg.reply(
        `Unable to find message ${ticket.messageId} in ${channel}.`
      )
    }

    const newEmbed = new MessageEmbed()

    newEmbed
      .setAuthor(ticket.title)
      .setColor(ticket.color)
      .addField('ID', ticket.id, true)
      .addField(
        'Status',
        ticket.status +
          (ticket.closedReason ? ` (${ticket.closedReason})` : ''),
        true
      )
      .addField(
        'Submitted By',
        msg.guild.members.cache.get(ticket.userId),
        true
      )

    if (ticket.dateClosed) {
      newEmbed.addField(
        'Closed By',
        msg.guild.members.cache.get(ticket.closedUserId),
        true
      )
    }

    if (ticket.type && ticket.type !== 'default') {
      newEmbed.addField('Type', ticket.type.toUpperCase(), true)
    }

    newEmbed
      .addField('Description', newDescription)
      .setTimestamp(new Date(ticket.dateCreated))

    if (!originalMessage.editable) {
      return msg.reply('Message not editable.')
    }

    await originalMessage.edit(newEmbed)

    return msg.reply('Edit successful.')
  }
}
