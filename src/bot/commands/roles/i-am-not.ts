import { Role } from 'discord.js'
import { CommandoMessage } from 'discord.js-commando'
import { Command } from '../../base'
import { Client } from '../../models'

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

    try {
      await msg.member?.roles.remove(role)
    } catch {
      // swallow
    }

    return msg.reply(`You are no longer a **${role.name}**!`)
  }
}
