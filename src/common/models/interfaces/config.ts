export interface Config {
  api: ApiConfig
  bot: BotConfig
  optional: OptionalSettings
}

export interface ApiConfig {
  address: string
  secret: string
}

export interface BotConfig {
  autoDeleteMessages: {
    delay: number
    enabled: boolean
  }
  autoReconnect: boolean
  botName: string
  clientId: string
  clientSecret: string
  ownerId: string
  playingStatus: {
    cycleIntervalMinutes: number
    options: string[]
    url: string
  }
  prefix: string
  token: string
}

export interface OptionalSettings {
  dataDogApiKey?: string
  dataDogAppKey?: string
  giphyApiKey?: string
  googleApiKey?: string
  imgur?: ImgurSettings
  premium?: PremiumSettings
  steamWebApiKey?: string
}

export interface ImgurSettings {
  clientId: string
  clientSecret: string
}

export interface PremiumSettings {
  premiumPatreonRoleId?: string
  premiumPluginRepo?: string
  primaryGuildId?: string
}
