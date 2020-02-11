import { CommandOptions } from 'bot-ts'

export interface CommandInfo extends CommandOptions {
  readonly premiumOnly?: boolean
}
