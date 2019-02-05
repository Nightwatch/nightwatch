import { PermissionResolvable } from 'discord.js'

export type CommandInfo = {
  name: string
  aliases?: string[]
  autoAliases?: boolean
  group: string
  memberName: string
  description: string
  format?: string
  details?: string
  examples?: string[]
  nsfw?: boolean
  guildOnly?: boolean
  ownerOnly?: boolean
  clientPermissions?: PermissionResolvable[]
  userPermissions?: PermissionResolvable[]
  defaultHandling?: boolean
  throttling?: ThrottlingOptions
  args?: ArgumentInfo[]
  argsPromptLimit?: number
  argsType?: string
  argsCount?: number
  argsSingleQuotes?: boolean
  patterns?: RegExp[]
  guarded?: boolean
  hidden?: boolean
  unknown?: boolean
  premiumOnly: boolean
}

type ArgumentInfo = {
  key: string
  label?: string
  prompt: string
  error?: string
  type?: string
  max?: number
  min?: number
  oneOf?: any[]
  default?: any | Function
  infinite?: boolean
  validate?: Function
  parse?: Function
  isEmpty?: Function
  wait?: number
}

type ThrottlingOptions = {
  usages: number
  duration: number
}
