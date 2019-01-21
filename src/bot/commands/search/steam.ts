import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { SteamProvider, SteamSearchEntry } from 'steam-provider'

export default class SteamCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'steam',
      group: 'search',
      memberName: 'steam',
      description: 'Search a game on Steam.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run (
    msg: CommandoMessage
  ): Promise<Message | Message[]> {
    const game = msg.argString
    const provider = new SteamProvider()

    const searchResults = await provider.search(game)

    if (!searchResults || searchResults.length === 0) {
      return msg.reply(`I wasn't able to find anything for **${game}**.`)
    }

    if (searchResults.length === 1) {
      const result = await this.getEmbedForGame(searchResults[0], provider, msg)
      return msg.channel.send(result)
    }

    const resultsEmbed = new MessageEmbed()
    resultsEmbed.setTitle('Which game would you like to see?')
    resultsEmbed.setDescription(
      searchResults.map((sr, i) => `${i + 1}.) ${sr.$name}`).join('\n')
    )
    resultsEmbed.setFooter(
      'Reply with the number of the game you would like to see. Ex.: 2'
    )

    msg.reply(resultsEmbed)

    const messages = await msg.channel.awaitMessages(
      (message: Message) =>
        message.author.id === msg.author.id &&
        (!!searchResults[Number(message.content) - 1] ||
          message.content.toLowerCase() === 'cancel'),
      { time: 60000, max: 1 }
    )

    const firstMessage = messages.first()

    if (!firstMessage || firstMessage.content.toLowerCase() === 'cancel') {
      return msg.reply('Cancelled command.')
    }

    const result = await this.getEmbedForGame(
      searchResults[Number(firstMessage.content) - 1],
      provider,
      msg
    )
    return msg.channel.send(result)
  }

  public async getEmbedForGame (
    game: SteamSearchEntry,
    provider: SteamProvider,
    msg: CommandoMessage
  ): Promise<MessageEmbed | string> {
    const steamEmbed = new MessageEmbed()

    const gameId = game.$id

    const details = await provider.detail(gameId)

    if (!details) {
      return 'An error has ocurred while performing the request.'
    }

    const genres = details.$genres
    const platforms = details.$otherData.$platforms

    let finalPrice = details.$priceData.$finalPrice
    if (finalPrice.length < 3) {
      finalPrice = '0' + finalPrice
    }

    steamEmbed
      .setColor(msg.member ? msg.member.displayHexColor : '#ff0000')
      .setTitle(details.$name)
      .setURL(`http://store.steampowered.com/app/${gameId}/`)
      .setImage(details.$otherData.$imageUrl)
      .addField(`Price in USD`, `$${details.$priceData.$finalPrice}`, true)
      .addField('Platforms', platforms.join(', '), true)
      .addField('Genres', genres.join(', '), true)
      .addField('Developer(s)', details.$otherData.$developer, true)
      .addField('Publisher(s)', details.$otherData.$publisher, true)
      .addField(
        'Steam Store Link',
        `http://store.steampowered.com/app/${gameId}/`,
        false
      )

    return steamEmbed
  }
}
