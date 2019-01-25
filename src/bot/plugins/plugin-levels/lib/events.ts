import { Message } from 'discord.js'
import { giveXp } from './'
import { UserService } from '../../../services'

export const onMessage = async (message: Message) => {
  if (
    message.author.bot ||
    !message.content ||
    !message.content.trim() ||
    message.channel.type !== 'text'
  ) {
    return
  }

  const userService = new UserService()

  // prevent the user from earning xp for bot commands.
  // handles *most* bots.
  const firstTwoMatch = message.content
    .trim()
    .substring(0, 2)
    .toLowerCase()
    .match(/[a-z]/gi)
  if (
    !firstTwoMatch ||
    firstTwoMatch.length !== 2 ||
    message.content.indexOf(' ') <= 2
  ) {
    return
  }

  const user = await userService.find(message.author.id)

  if (!user) {
    return
  }

  giveXp(user, message).catch(console.error)
}
