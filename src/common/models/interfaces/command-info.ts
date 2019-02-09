import { PermissionResolvable } from 'discord.js'

export interface CommandInfo {
  aliases?: string[]
  args?: ArgumentInfo[]
  argsCount?: number
  argsPromptLimit?: number
  argsSingleQuotes?: boolean
  argsType?: string
  autoAliases?: boolean
  clientPermissions?: PermissionResolvable[]
  defaultHandling?: boolean
  description: string
  details?: string
  examples?: string[]
  format?: string
  group: string
  guarded?: boolean
  guildOnly?: boolean
  hidden?: boolean
  memberName: string
  name: string
  nsfw?: boolean
  ownerOnly?: boolean
  patterns?: RegExp[]
  premiumOnly?: boolean
  throttling?: ThrottlingOptions
  unknown?: boolean
  userPermissions?: PermissionResolvable[]
}

interface ArgumentInfo {
  default?: any | Function
  error?: string
  infinite?: boolean
  isEmpty?: Function
  key: string
  label?: string
  max?: number
  min?: number
  oneOf?: any[]
  parse?: Function
  prompt: string
  type?: string
  validate?: Function
  wait?: number
}

interface ThrottlingOptions {
  duration: number
  usages: number
}
