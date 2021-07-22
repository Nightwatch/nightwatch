import { Role } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { GuildService } from '../../services'
import { GuildSelfAssignableRole } from '../../../db'
import { Command } from '../../base'
import { Client } from '../../models'

export default class AddSelfAssignableRoleCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'asar',
      group: 'roles',
      memberName: 'asar',
      description:
        'Add a self assignable role that users can assign to themselves.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'role',
          prompt: 'What role should I add as a self assignable role?\n',
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
        : msg.guild.roles.resolve(args.role.toLowerCase().trim())

    if (!role) {
      return msg.reply(`Could not find a role named ${args.role}`)
    }

    if (
      role.position >= (msg.member?.roles.highest.position || 0) &&
      msg.member?.id !== msg.guild.owner?.id
    ) {
      return msg.reply('You cannot add that role as a self assignable role.')
    }

    const guildService = new GuildService()

    const guild = await guildService.find(msg.guild.id)

    if (!guild) {
      return msg.reply('Command failed. Guild not found in my database.')
    }

    const selfAssignableRole = new GuildSelfAssignableRole()
    selfAssignableRole.roleId = role.id
    selfAssignableRole.guild = guild

    await guildService.createSelfAssignableRole(
      msg.guild.id,
      selfAssignableRole
    )

    return msg.channel.send(
      `Successfully added **${role.name}** as a self assignable role!`
    )
  }
}
