import { Command } from '../../base'
import { Client, Message } from 'bot-ts'

export default class RockPaperScissorsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'rps',
      group: 'games',
      description: 'Rock paper scissors.',
      guildOnly: false,
      args: [
        {
          key: 'choice',
          phrase: 'Which option do you want to pick?\n',
          type: 'string'
        }
      ]
    })
  }

  public async run(msg: Message, args: { choice: string }) {
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
      choice.name.startsWith(args.choice.toLowerCase()[0])
    )

    if (!userChoice) {
      return msg.reply(`Unknown option ${args.choice}.`)
    }

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
      `It's a draw! You chose ${userChoice.name} and I chose ${randomChoice.name}.`
    )
  }
}
