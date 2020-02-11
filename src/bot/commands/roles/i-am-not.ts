import { Role } from 'discord.js'
import { Command } from '../../base'
import { Message, Client } from 'bot-ts'

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

  public async run(msg: Message, args: any) {
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
      await msg.member.removeRole(role)
    } catch {
      // swallow
    }

    return msg.reply(`You are no longer a **${role.name}**!`)
  }
}
