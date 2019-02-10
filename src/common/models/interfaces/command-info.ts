// tslint:disable:readonly-array ban-types

import { PermissionResolvable } from 'discord.js'

export interface CommandInfo {
  readonly aliases?: string[]
  readonly args?: ArgumentInfo[]
  readonly argsCount?: number
  readonly argsPromptLimit?: number
  readonly argsSingleQuotes?: boolean
  readonly argsType?: string
  readonly autoAliases?: boolean
  readonly clientPermissions?: PermissionResolvable[]
  readonly defaultHandling?: boolean
  readonly description: string
  readonly details?: string
  readonly examples?: string[]
  readonly format?: string
  readonly group: string
  readonly guarded?: boolean
  readonly guildOnly?: boolean
  readonly hidden?: boolean
  readonly memberName: string
  readonly name: string
  readonly nsfw?: boolean
  readonly ownerOnly?: boolean
  readonly patterns?: RegExp[]
  readonly premiumOnly?: boolean
  readonly throttling?: ThrottlingOptions
  readonly unknown?: boolean
  readonly userPermissions?: PermissionResolvable[]
}

interface ArgumentInfo {
  readonly default?: any | Function
  readonly error?: string
  readonly infinite?: boolean
  readonly isEmpty?: Function
  readonly key: string
  readonly label?: string
  readonly max?: number
  readonly min?: number
  readonly oneOf?: any[]
  readonly parse?: Function
  readonly prompt: string
  readonly type?: string
  readonly validate?: Function
  readonly wait?: number
}

interface ThrottlingOptions {
  readonly duration: number
  readonly usages: number
}
