import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { GuildService } from '../../services'
import { GuildSelfAssignableRole } from '../../../db'

export default class ListSelfAssignableRolesCommand extends Command {
  constructor (client: CommandoClient) {
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

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const guildService = new GuildService()

    const roles = await guildService.findSelfAssignableRoles(msg.guild.id) as GuildSelfAssignableRole[]

    if (!roles || roles.length === 0) {
      return msg.reply('No self assignable roles found.')
    }

    const rolesString = roles.map(x => `**${msg.guild.roles.find(role => x.roleId === role.id).name}**`).join(', ')

    return msg.channel.send(`These are the available self assignable roles for ${msg.guild.name}: ${rolesString}`)
  }
}
