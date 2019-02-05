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

export interface OptionalSettings {
  dataDogApiKey?: string
  dataDogAppKey?: string
  steamWebApiKey?: string
  giphyApiKey?: string
  imgur?: ImgurSettings
  premium?: PremiumSettings
  googleApiKey?: string
}

export interface ImgurSettings {
  clientId: string
  clientSecret: string
}

export interface PremiumSettings {
  primaryGuildId?: string
  premiumPatreonRoleId?: string
  premiumPluginRepo?: string
}
