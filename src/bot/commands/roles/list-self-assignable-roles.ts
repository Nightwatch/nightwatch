import { CommandoMessage } from 'discord.js-commando'
import { GuildService } from '../../services'
import { GuildSelfAssignableRole } from '../../../db'
import { Command } from '../../base'
import { Client } from '../../models'

export default class ListSelfAssignableRolesCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'lsar',
      group: 'roles',
      memberName: 'lsar',
      description: 'List the self assignable roles for this guild.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  public async run(msg: CommandoMessage) {
    const guildService = new GuildService()

    const roles = (await guildService.findSelfAssignableRoles(
      msg.guild.id
    )) as ReadonlyArray<GuildSelfAssignableRole>

    if (!roles || roles.length === 0) {
      return msg.reply('No self assignable roles found.')
    }

    const rolesString = roles
      .map(
        x => `**${msg.guild.roles.resolve(x.roleId)?.name}**`
      )
      .join(', ')

    return msg.channel.send(
      `These are the available self assignable roles for ${msg.guild.name}: ${rolesString}`
    )
  }
}
