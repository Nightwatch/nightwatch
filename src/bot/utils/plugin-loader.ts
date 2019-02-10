import { CommandoClient } from 'discord.js-commando'
import { readdirSync, lstatSync, existsSync } from 'fs'
import * as path from 'path'
import { Config } from '../../common'

const prefix = '[Plugin Loader]'

export interface PluginStatus {
  readonly Plugin: any
  readonly loaded: boolean
  readonly commandsRegistered: boolean | null
}

const isDirectory = (source: string) => lstatSync(source).isDirectory()
const getDirectories = (source: string) =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)
let pluginPaths = getDirectories(path.join(__dirname, '..', 'plugins'))

try {
  pluginPaths = pluginPaths.concat(
    getDirectories(path.join(__dirname, '..', 'plugins', 'plugin-premium'))
  )
} catch {
  // swallow
}

export const loadPlugins = async (client: CommandoClient, config: Config) => {
  const pluginStatuses: PluginStatus[] = []

  console.log(`${prefix}: ${pluginPaths.length} external plugins found.`)

  pluginPaths.forEach(async file => {
    try {
      const BotPlugin = require(path.resolve(file)).Plugin
      let commandsRegistered: boolean | null = null
      try {
        console.log(`${prefix}[${BotPlugin.id}]: Loading plugin...`)

        if (existsSync(file + '/commands')) {
          try {
            console.log(`${prefix}[${BotPlugin.id}]: Registering commands...`)
            if (BotPlugin.commandGroups && BotPlugin.commandGroups.length > 0) {
              client.registry.registerGroups(BotPlugin.commandGroups)
              console.log(
                `${prefix}[${BotPlugin.id}]: Registered ${
                  BotPlugin.commandGroups.length
                } new command group${
                  BotPlugin.commandGroups.length === 1 ? '' : 's'
                }.`
              )
            }
            client.registry.registerCommandsIn(file + '/commands')
            console.info(
              `${prefix}[${BotPlugin.id}]: Successfully registered commands!`
            )
            commandsRegistered = true
          } catch (err) {
            console.warn(`${prefix}[${
              BotPlugin.id
            }]: An error occurred while registering commands.
            Plugin may still load, but none of its commands will work.`)
            console.error(err)
            commandsRegistered = false
          }
        }

        await new BotPlugin().init(client, config)

        pluginStatuses.push({
          Plugin: BotPlugin,
          loaded: true,
          commandsRegistered
        })

        console.log(`${prefix}[${BotPlugin.id}]: Successfully loaded!`)
      } catch (err) {
        console.warn(`${prefix}[${
          BotPlugin.id
        }]: An error occurred while loading plugin.
        Some of its features may not work.`)
        console.error(err)
        pluginStatuses.push({
          Plugin: BotPlugin,
          loaded: false,
          commandsRegistered
        })
      }
    } catch {
      // swallow
    }
  })
  return pluginStatuses
}
