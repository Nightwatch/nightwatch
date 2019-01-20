export interface Config {
  api: ApiConfig
  bot: BotConfig
  db: DatabaseConfig
  dataDogApiKey: string
  dataDogAppKey: string
  steamWebApiKey: string
}

export interface ApiConfig {
  address: string
  secret: string
}

export interface BotConfig {
  token: string
  botName: string
  prefix: string
  ownerId: string
  autoReconnect: boolean
  autoDeleteMessages: {
    enabled: boolean
    delay: number
  },
  playingStatus: {
    url: string
    cycleIntervalMinutes: number
    options: string[]
  },
  clientId: string
  clientSecret: string
}

export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
  synchronize: boolean
  logging: boolean
  cache: {
    type: string
    duration: number
    options: {
      host: string
      port: number
    }
  }
}
