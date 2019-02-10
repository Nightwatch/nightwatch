export type Event =
  | UserEvent
  | UserLevelEvent
  | UserBalanceEvent
  | UserProfileEvent
  | UserSettingsEvent
  | UserFriendEvent
  | UserFriendRequestEvent
  | GuildEvent
  | GuildSuggestionEvent
  | GuildSupportTicketEvent
  | GuildUserEvent
  | GuildSettingsEvent
  | ReferralEvent
  | GiveawayEvent
  | ApiEvent

export enum UserEvent {
  USER_CREATE = 'userCreated',
  USER_DELETE = 'userDeleted',
  USER_UPDATE = 'userUpdated'
}

export enum UserLevelEvent {
  USER_LEVEL_UPDATE = 'userLevelUpdated'
}

export enum UserBalanceEvent {
  USER_BALANCE_UPDATE = 'userBalanceUpdated'
}

export enum UserProfileEvent {
  USER_PROFILE_UPDATE = 'userProfileUpdated'
}

export enum UserSettingsEvent {
  USER_SETTINGS_UPDATE = 'userSettingsUpdated'
}

export enum UserFriendEvent {
  USER_FRIEND_CREATE = 'userFriendCreated',
  USER_FRIEND_DELETE = 'userFriendDeleted'
}

export enum UserFriendRequestEvent {
  USER_FRIEND_REQUEST_CREATE = 'userFriendRequestCreated',
  USER_FRIEND_REQUEST_DELETE = 'userFriendRequestDeleted'
}

export enum GuildEvent {
  GUILD_CREATE = 'guildCreated',
  GUILD_DELETE = 'guildDeleted',
  GUILD_UPDATE = 'guildUpdated'
}

export enum GuildSuggestionEvent {
  GUILD_SUGGESTION_CREATE = 'guildSuggestionCreated',
  GUILD_SUGGESTION_DELETE = 'guildSuggestionDeleted',
  GUILD_SUGGESTION_UPDATE = 'guildSuggestionUpdated'
}

export enum GuildSupportTicketEvent {
  GUILD_SUPPORT_TICKET_CREATE = 'guildSupportTicketCreated',
  GUILD_SUPPORT_TICKET_UPDATE = 'guildSupportTicketUpdated',
  GUILD_SUPPORT_TICKET_DELETE = 'guildSupportTicketDeleted'
}

export enum GuildUserEvent {
  GUILD_USER_CREATE = 'guildUserCreated',
  GUILD_USER_DELETE = 'guildUserDeleted',
  GUILD_USER_UPDATE = 'guildUserUpdated'
}

export enum GuildSettingsEvent {
  GUILD_SETTINGS_UPDATE = 'guildSettingsUpdated'
}

export enum ReferralEvent {
  REFERRAL_CREATE = 'referralCreated',
  REFERRAL_DELETE = 'referralDeleted',
  REFERRAL_UPDATE = 'referralUpdated'
}

export enum GiveawayEvent {
  GIVEAWAY_CREATE = 'giveawayCreated',
  GIVEAWAY_DELETE = 'giveawayCreated',
  GIVEAWAY_UPDATE = 'giveawayCreated'
}

export enum ApiEvent {
  INFO = 'info'
}
