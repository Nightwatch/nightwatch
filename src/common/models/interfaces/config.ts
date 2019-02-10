export interface Config {
  readonly api: ApiConfig
  readonly bot: BotConfig
  readonly optional: OptionalSettings
}

export interface ApiConfig {
  readonly address: string
  readonly secret: string
}

export interface BotConfig {
  readonly autoDeleteMessages: {
    readonly delay: number
    readonly enabled: boolean
  }
  readonly autoReconnect: boolean
  readonly botName: string
  readonly clientId: string
  readonly clientSecret: string
  readonly ownerId: string
  readonly playingStatus: {
    readonly cycleIntervalMinutes: number
    readonly options: ReadonlyArray<string>
    readonly url: string
  }
  readonly prefix: string
  readonly token: string
}

export interface OptionalSettings {
  readonly dataDogApiKey?: string
  readonly dataDogAppKey?: string
  readonly giphyApiKey?: string
  readonly googleApiKey?: string
  readonly imgur?: ImgurSettings
  readonly premium?: PremiumSettings
  readonly steamWebApiKey?: string
}

export interface ImgurSettings {
  readonly clientId: string
  readonly clientSecret: string
}

export interface PremiumSettings {
  readonly premiumPatreonRoleId?: string
  readonly premiumPluginRepo?: string
  readonly primaryGuildId?: string
}
