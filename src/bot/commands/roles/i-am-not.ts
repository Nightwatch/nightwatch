import { Role } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'
import { GuildService } from '../../services'

export default class IAmNotRoleCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'iamnot',
      group: 'roles',
      memberName: 'iamnot',
      description: 'Remove one of your roles.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'role',
          prompt: 'What role do you want to remove?\n',
          type: 'role|string'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const role: Role =
      args.role instanceof Role
        ? args.role
        : msg.guild.roles.cache.find(x => x.name === args.role.toLowerCase().trim())

    if (!role) {
      return msg.reply(
        `Could not find a self assignable role named ${args.role}`
      )
    }

    const guildService = new GuildService()

    try {
      const selfAssignableRole = await guildService.findSelfAssignableRole(msg.guild.id, role.id)
      
      if (!selfAssignableRole)
      {
        return msg.reply(`That is not a self assignable role!`)
      }

      if (!msg.member?.roles.cache.has(role.id)) {
        return msg.reply(`You are not a **${role.name}**!`)
      }

      await msg.member?.roles.remove(role)
    } catch {
      return msg.reply(`Unable to remove you as a **${role.name}**.`)
    }

    return msg.reply(`You are no longer a **${role.name}**!`)
  }
}
