import { Role } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class IAmRoleCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'iam',
      group: 'roles',
      memberName: 'iam',
      description: 'Give yourself a role.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'role',
          prompt: 'What role do you want?\n',
          type: 'role|string'
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const role: Role =
      args.role instanceof Role
        ? args.role
        : msg.guild.roles.find(
            x => x.name.toLowerCase() === args.role.toLowerCase().trim()
          )

    if (!role) {
      return msg.reply(
        `Could not find a self assignable role named ${args.role}`
      )
    }

    try {
      await msg.member.roles.add(role)
    } catch {
      // swallow
    }

    return msg.reply(`You are now a **${role.name}**!`)
  }
}
