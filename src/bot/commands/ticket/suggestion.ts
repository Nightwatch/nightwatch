import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { oneLine } from 'common-tags'
import { GuildSuggestion } from '../../../db'
import { GuildService } from '../../services'

export default class SuggestionCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'suggest',
      group: 'misc',
      memberName: 'suggest',
      description: 'Create a suggestion that people can vote on.',
      details: `Create a suggestion that people can vote on.

        The supported actions:
        __suggest create <description>:__ Creates a suggestion.
        __suggest edit <ID>:__ Edits your suggestion.`,
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'action',
          prompt: 'What do you want to do?\n',
          type: 'string',
          default: 'create',
          parse: (str: string) => str.toLowerCase()
        },
        {
          key: 'suggestion',
          prompt: 'What do you suggest?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run (
    msg: CommandoMessage,
    args: any
  ): Promise<Message | Message[]> {
    const { action, suggestion }: { action: string, suggestion: string } = args

    switch (action.trim().toLowerCase()) {
      case 'create':
        return this.createSuggestion(msg, suggestion)
      case 'edit':
        return this.editSuggestion(msg, suggestion)
      default:
        return this.createSuggestion(
          msg,
          action.charAt(0).toUpperCase() +
            action.substring(1) +
            (suggestion ? ' ' + suggestion : '')
        )
    }
  }

  private async createSuggestion (msg: CommandoMessage, suggestion: string) {
    const channel = msg.guild.channels.find(
      x => x.name === 'suggestions' && x.type === 'text'
    )

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find suggestions channel.
          If you are an admin, please create a #suggestions text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id)

    if (!guild) {
      return msg.reply(
        oneLine`This guild does not exist in my database.
          An entry has been created. Please try the command again.`
      )
    }

    const embed = new MessageEmbed()

    embed
      .setAuthor(
        'New Suggestion',
        this.client.user ? this.client.user.avatarURL({ format: 'png' }) : undefined
      )
      .setColor(msg.member ? msg.member.displayHexColor : '#ff0000')
      .setFooter('Like it? 👍 or 👎')
      .addField('Suggested By', msg.member, true)
      .addField('Description', suggestion)
      .setTimestamp(new Date())
    ;(channel as TextChannel)
      .send(embed)
      .then(async (m: Message | Message[]) => {
        const suggestionMessage = m as Message
        const dbSuggestion = new GuildSuggestion()
        dbSuggestion.color = msg.member ? msg.member.displayHexColor : '#ff0000'
        dbSuggestion.description = suggestion
        dbSuggestion.dislikes = 0
        dbSuggestion.likes = 0
        dbSuggestion.guild = guild
        dbSuggestion.userId = msg.author.id
        dbSuggestion.messageId = suggestionMessage.id

        await guildService.createSuggestion(msg.guild.id, dbSuggestion)

        const editedEmbed = new MessageEmbed()

        editedEmbed
          .setAuthor(
            'New Suggestion',
            this.client.user ? this.client.user.avatarURL({ format: 'png' }) : undefined
          )
          .setColor(msg.member ? msg.member.displayHexColor : '#ff0000')
          .setFooter('Like it? 👍 or 👎')
          .addField('Suggested By', msg.member, true)
          .addField('Description', suggestion)
          .setTimestamp(new Date())

        await suggestionMessage.edit(editedEmbed)
        await suggestionMessage.react('👍')
        await suggestionMessage.react('👎')
        return undefined
      })
      .catch((err: Error) => {
        console.error(err)
        return msg.channel.send('Error occurred while creating suggestion.')
      })

    return msg.reply(
      `Your suggestion has been added. Check it out in ${channel}`
    )
  }
  private async editSuggestion (msg: CommandoMessage, description: string) {
    const channel = msg.guild.channels.find(
      x => x.name === 'suggestions' && x.type === 'text'
    )

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find suggestions channel.
          If you are an admin, please create a #suggestions text channel.`
      )
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id)

    if (!guild) {
      return msg.reply(
        oneLine`This guild does not exist in my database.
          An entry has been created. Please try the command again.`
      )
    }

    const suggestions = guild.suggestions || []

    const suggestionId = Number(
      description.substring(0, description.indexOf(' ')).trim()
    )
    const suggestion = suggestions.find(x => x.id === suggestionId)

    if (!suggestion) {
      return msg.reply(`Suggestion ${suggestionId} not found.`)
    }

    const isSuggestionOwner = msg.member.id === suggestion.userId
    const newDescription = description
      .substring(description.indexOf(' '))
      .trim()

    const rolesWithPerm = [
      'Owner',
      'Co-Owner',
      'Manager',
      'Senior Administrator',
      'Administrator'
    ]

    if (
      !msg.member.roles.some(x => rolesWithPerm.includes(x.name)) &&
      !isSuggestionOwner
    ) {
      return msg.reply("You don't have permission to do that.")
    }

    const originalMessage = (channel as TextChannel).messages.find(
      x => x.id === suggestion.messageId
    )

    if (!originalMessage) {
      return msg.reply(
        `Unable to find message ${suggestion.messageId} in ${channel}.`
      )
    }

    const newEmbed = new MessageEmbed()

    newEmbed
      .setAuthor(
        'New Suggestion',
        this.client.user ? this.client.user.avatarURL({ format: 'png' }) : undefined
      )
      .setColor(suggestion.color)
      .setFooter('Like it? 👍 or 👎')
      .addField('ID', suggestion.id, true)
      .addField('Suggested By', msg.guild.members.get(suggestion.userId), true)
      .addField('Description', newDescription)
      .setTimestamp(new Date(suggestion.dateCreated))

    suggestion.description = newDescription

    await guildService.updateSuggestion(msg.guild.id, suggestionId, suggestion)

    if (!originalMessage.editable) {
      return msg.reply('Message not editable.')
    }

    originalMessage.edit(newEmbed)

    return msg.reply('Edit successful.')
  }
}
