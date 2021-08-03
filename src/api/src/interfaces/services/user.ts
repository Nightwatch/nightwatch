import { BaseService } from '../base-service'
import {
  User,
  UserBalance,
  UserProfile,
  UserSettings,
  UserFriend,
  UserFriendRequest,
  GuildUserMessage
} from '../../../../db/'
import { UserLevelBalance } from '../../models'

export interface UserService extends BaseService<User, string> {
  readonly updateLevel: (
    id: string,
    userLevelBalance: UserLevelBalance
  ) => Promise<UserLevelBalance | undefined>
  readonly updateBalance: (
    id: string,
    userBalance: UserBalance
  ) => Promise<UserBalance | undefined>
  readonly findProfile: (id: string) => Promise<UserProfile | undefined>
  readonly updateProfile: (
    id: string,
    userProfile: UserProfile
  ) => Promise<UserProfile | undefined>
  readonly updateSettings: (
    id: string,
    userSettings: UserSettings
  ) => Promise<UserSettings | undefined>
  readonly findSettings: (id: string) => Promise<UserSettings | undefined>
  readonly findFriendRequests: (
    id: string,
    type: 'incoming' | 'outgoing'
  ) => Promise<ReadonlyArray<UserFriendRequest>>
  readonly findFriendRequestByUserId: (
    id: string,
    userId: string
  ) => Promise<UserFriendRequest | undefined>
  readonly searchFriendRequests: (
    id: string,
    skip: number,
    take: number,
    userId?: string,
    name?: string,
    type?: 'incoming' | 'outgoing'
  ) => Promise<ReadonlyArray<UserFriendRequest>>
  readonly createFriendRequest: (
    _: string,
    request: UserFriendRequest
  ) => Promise<UserFriendRequest>
  readonly deleteFriendRequest: (id: string, userId: string) => Promise<void>
  readonly findFriends: (id: string) => Promise<ReadonlyArray<UserFriend>>
  readonly findFriendByUserId: (
    id: string,
    userId: string
  ) => Promise<UserFriend | undefined>
  readonly searchFriends: (
    id: string,
    skip: number,
    take: number,
    userId?: string,
    name?: string
  ) => Promise<ReadonlyArray<UserFriend>>
  readonly addFriend: (id: string, friend: UserFriend) => Promise<UserFriend | undefined>
  readonly deleteFriend: (id: string, userId: string) => Promise<void>
  readonly findMessages: (id: string) => Promise<GuildUserMessage[]>
}
