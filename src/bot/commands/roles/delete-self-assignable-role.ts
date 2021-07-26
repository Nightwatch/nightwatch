import { Role } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { GuildService } from '../../services'
import { Command } from '../../base'
import { Client } from '../../models'

export default class DeleteSelfAssignableRoleCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'dsar',
      group: 'roles',
      memberName: 'dsar',
      description: 'Delete a self assignable role.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'role',
          prompt: 'What role should I delete?\n',
          type: 'role|string'
        }
      ]
    })
  }

  public hasPermission(msg: CommandoMessage) {
    return !!msg.member?.permissions.has('MANAGE_ROLES')
  }

  public async run(msg: CommandoMessage, args: any) {
    const role: Role =
      args.role instanceof Role
        ? args.role
        : msg.guild.roles.cache.find(x => x.name === args.role.toLowerCase().trim())

    if (!role) {
      return msg.reply(`Could not find a role named ${args.role}`)
    }

    if (
      role.position >= (msg.member?.roles.highest.position || 0) &&
      msg.member?.id !== msg.guild.owner?.id
    ) {
      return msg.reply('You cannot remove that role as a self assignable role.')
    }

    const guildService = new GuildService()

    try {
      await guildService.deleteSelfAssignableRole(msg.guild.id, role.id)
    } catch {
      return msg.reply('Failed to delete self assignable role. Does it exist?')
    }

    return msg.channel.send(
      `Successfully removed **${role.name}** as a self assignable role!`
    )
  }
}
