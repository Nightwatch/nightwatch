import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import { Command } from '../../base'

export default class RockPaperScissorsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'rps',
      group: 'games',
      memberName: 'rps',
      description: 'Rock paper scissors.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'choice',
          prompt: 'Which option do you want to pick?\n',
          type: 'string',
          validate: (option: string) =>
            ['rock', 'paper', 'scissors', 'r', 'p', 's'].includes(
              option.toLowerCase()
            )
        }
      ]
    })
  }

  public async run(msg: CommandoMessage, args: any) {
    const userChoiceString = args.choice as string

    enum RPS {
      Rock = 'rock',
      Paper = 'paper',
      Scissors = 'scissors'
    }

    const choices: ReadonlyArray<any> = [
      { name: RPS.Rock, beats: RPS.Scissors },
      { name: RPS.Paper, beats: RPS.Rock },
      { name: RPS.Scissors, beats: RPS.Paper }
    ]

    const randomChoice = choices[Math.floor(Math.random() * choices.length)]
    const userChoice = choices.find(choice =>
      choice.name.startsWith(userChoiceString.toLowerCase()[0])
    )!

    if (randomChoice.beats === userChoice.name) {
      return msg.reply(`I win! I chose ${randomChoice.name}. Try again.`)
    }

    if (randomChoice.name === userChoice.name) {
      return msg.reply(`It's a draw! We both chose ${randomChoice.name}.`)
    }

    if (userChoice.beats === randomChoice.name) {
      return msg.reply(`You win! I chose ${randomChoice.name}.`)
    }

    return msg.reply(
      `It's a draw! You chose ${userChoice.name} and I chose ${
        randomChoice.name
      }.`
    )
  }
}
