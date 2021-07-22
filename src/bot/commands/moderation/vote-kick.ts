import { Message, GuildMember, MessageEmbed } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

export default class VoteKickCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'votekick',
      group: 'moderation',
      memberName: 'votekick',
      description: 'Vote to kick a user from guild.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who should I kick?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'Why should I kick them?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const member = args.member as GuildMember

    const yesVote = '✅'
    const noVote = '❎'

    const votesRequired = msg.guild.memberCount / 5 + 1
    const timeInSeconds = 10

    const embed = new MessageEmbed()
      .setAuthor(`Kick ${member.displayName}?`)
      .setColor('ORANGE')
      .addField('Vote by', msg.member?.displayName, true)
      .addField('To kick', member.displayName, true)
      .addField('Votes needed', votesRequired, true)
      .addField('Time', `${timeInSeconds} seconds`)
      .addField('Reason', args.reason)

    const sentMessage = (await msg.channel.send(embed)) as Message

    await sentMessage.react(yesVote)
    await sentMessage.react(noVote)

    const reactions = await sentMessage.awaitReactions(
      r => r.emoji.name === yesVote || r.emoji.name === noVote,
      {
        time: 1000 * timeInSeconds
      }
    )

    const yesVotes = reactions.get(yesVote)
    const noVotes = reactions.get(noVote)

    if (
      !yesVotes || !yesVotes.count ||
      yesVotes.count < votesRequired ||
      (noVotes && noVotes.count && noVotes.count > yesVotes.count)
    ) {
      return msg.channel.send('The vote did not pass.')
    }

    await member.kick(args.reason)

    return msg.channel.send(
      `The vote passed. ${member.displayName} has been kicked.`
    )
  }
}
