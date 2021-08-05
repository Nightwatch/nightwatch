import { GuildMember, MessageEmbed } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'
import { GuildService } from '../../services'

export default class KickCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'modlog',
      group: 'moderation',
      memberName: 'modlog',
      description: 'See a moderation log for a user.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Who do you want to view?\n',
          type: 'member'
        },
      ]
    })
  }

  public async run(msg: CommandoMessage, args: {member: GuildMember, reason: string}) {
    const guildService = new GuildService()

    const warnings = await guildService.findWarningsToUserId(msg.guild.id, args.member.id)
    const kicks = await guildService.findKicksToUserId(msg.guild.id, args.member.id)
    const bans = await guildService.findBansToUserId(msg.guild.id, args.member.id)

    const embed = new MessageEmbed()
    embed.setTitle(`${args.member.displayName}'s Moderation Log`)
    embed.addField('Warnings', warnings.length)
    warnings.length > 0 && embed.addField('Latest Warning', warnings.sort((a,b) => a.timestamp.valueOf() > b.timestamp.valueOf() ? 1 : -1)[0].reason, true)
    embed.addField('Kicks', kicks.length)
    kicks.length > 0 && embed.addField('Latest Kick', kicks.sort((a,b) => a.timestamp.valueOf() > b.timestamp.valueOf() ? 1 : -1)[0].reason, true)
    embed.addField('Bans', bans.length)
    bans.length > 0 && embed.addField('Latest Ban', bans.sort((a,b) => a.timestamp.valueOf() > b.timestamp.valueOf() ? 1 : -1)[0].reason, true)

    return msg.channel.send(embed)
  }
}
