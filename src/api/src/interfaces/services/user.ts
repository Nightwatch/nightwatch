import { BaseService } from '../base-service'
import { User, UserBalance, UserProfile, UserSettings, UserFriend, UserFriendRequest } from '../../../../db/'
import { UserLevelBalance } from '../../models'

export interface UserService extends BaseService<User, string> {
  updateLevel: (id: string, userLevelBalance: UserLevelBalance) => Promise<void>
  updateBalance: (id: string, userBalance: UserBalance) => Promise<void>
  findProfile: (id: string) => Promise<UserProfile | undefined>
  updateProfile: (id: string, userProfile: UserProfile) => Promise<void>
  updateSettings: (id: string, userSettings: UserSettings) => Promise<void>
  findSettings: (id: string) => Promise<UserSettings | undefined>
  findFriendRequests: (id: string, type: 'incoming' | 'outgoing') => Promise<UserFriendRequest[]>
  findFriendRequestByUserId: (id: string, userId: string) => Promise<UserFriendRequest | undefined>
  searchFriendRequests: (id: string, skip: number, take: number, userId?: string, name?: string, type?: 'incoming' | 'outgoing') => Promise<UserFriendRequest[]>
  createFriendRequest: (_: string, request: UserFriendRequest) => Promise<void>
  deleteFriendRequest: (id: string, userId: string) => Promise<void>
  findFriends: (id: string) => Promise<UserFriend[]>
  findFriendByUserId: (id: string, userId: string) => Promise<UserFriend | undefined>
  searchFriends: (id: string, skip: number, take: number, userId?: string, name?: string) => Promise<UserFriend[]>
  addFriend: (id: string, friend: UserFriend) => Promise<void>
  deleteFriend: (id: string, userId: string) => Promise<void>
}
