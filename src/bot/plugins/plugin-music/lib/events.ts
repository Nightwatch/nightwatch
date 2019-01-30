import { Message } from 'discord.js'

export const onMessage = async (message: Message) => {
  if (
    message.author.bot ||
    !message.content ||
    !message.content.trim() ||
    message.channel.type !== 'text'
  ) {
    return
  }
}
