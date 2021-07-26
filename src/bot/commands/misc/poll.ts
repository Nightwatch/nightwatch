import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { oneLine } from 'common-tags'
import { Command } from '../../base'
import { Client } from '../../models'

export default class PollCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'poll',
      group: 'misc',
      memberName: 'poll',
      description: 'Create a poll.',
      examples: [
        'n.poll Do you like anime? [yes][no]',
        'Best platform for gaming? [PC Master Race][Xbox][PlayStation]'
      ],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'poll',
          prompt:
            // tslint:disable-next-line: max-line-length
            'What should the poll be? (Make sure to include the options in square brackets, like [Option 1][Option 2])\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const channel = msg.guild.channels.cache.find(x => x.name === 'poll' && x.type == 'text')

    if (!channel) {
      return msg.reply(
        oneLine`Unable to find poll channel.
          If you are an admin, please create a #poll text channel.`
      )
    }

    const letters: ReadonlyArray<any> = [
      '🇦',
      '🇧',
      '🇨',
      '🇩',
      '🇪',
      '🇫',
      '🇬',
      '🇭',
      '🇮',
      '🇯',
      '🇰',
      '🇱',
      '🇲',
      '🇳',
      '🇴',
      '🇵',
      '🇶',
      '🇷',
      '🇸',
      '🇹',
      '🇺',
      '🇻',
      '🇼',
      '🇽',
      '🇾',
      '🇿'
    ]

    const poll = args.poll as string

    const result = this.parseOptions(poll)

    if (!result || result.options.length === 0) {
      return msg.reply(
        'You forgot to include the options (e.g. [Yes][No]) or formatted them incorrectly.'
      )
    }

    if (result.options.length > 26) {
      return msg.reply('Too many options!')
    }

    const embed = new MessageEmbed()

    const options = result.options
      .map((value, index) => `${letters[index]} ${value}`)
      .join('\n')

    embed
      .setAuthor(result.poll)
      .setColor(msg.member ? msg.member.displayHexColor : '#ff0000')
      .addField('Options', options)
      .setTimestamp(new Date())

    const textChannel = channel as TextChannel

    const sentMessage = (await textChannel.send(embed)) as Message

    for (let i = 0; i < result.options.length; i++) {
      await sentMessage.react(letters[i])
    }

    return msg.channel.send(
      `There's a new poll in ${textChannel}! Go check it out.`
    )
  }

  private parseOptions(poll: string) {
    const leftCharacter = '\\['
    const rightCharacter = '\\]'
    const optionValueRegex = '([^\\]]+)'

    const regex = new RegExp(
      `${leftCharacter}${optionValueRegex}${rightCharacter}`,
      'g'
    )

    const matches = poll.match(regex)

    if (!matches) {
      return
    }

    let returnString = poll

    matches.forEach(x => {
      returnString = returnString.replace(x, '')
    })

    return {
      options: matches.map(x => x.substring(1, x.length - 1)),
      poll: returnString
    }
  }
}
