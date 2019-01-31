import { Message, Role } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'
import { GuildService } from '../../services'

export default class DeleteSelfAssignableRoleCommand extends Command {
  constructor (client: CommandoClient) {
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
    return msg.member.permissions.has('MANAGE_ROLES')
  }

  public async run (msg: CommandoMessage, args: any): Promise<Message | Message[]> {
    const role: Role = args.role instanceof Role ? args.role : msg.guild.roles.find(x => x.name.toLowerCase() === args.role.toLowerCase().trim())

    if (!role) {
      return msg.reply(`Could not find a role named ${args.role}`)
    }

    const guildService = new GuildService()

    try {
      await guildService.deleteSelfAssignableRole(msg.guild.id, role.id)
    } catch {
      return msg.reply('Failed to delete self assignable role. Does it exist?')
    }

    return msg.channel.send(`Successfully removed **${role.name}** as a self assignable role!`)
  }
}
