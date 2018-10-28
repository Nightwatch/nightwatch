import {
  User,
  UserBalance,
  UserProfile,
  UserSettings,
  UserFriend,
  UserFriendRequest
} from '../../../db'
import { getRepository, Like, FindManyOptions } from 'typeorm'
import { BaseService } from '../interfaces/BaseService'
import { UserLevelBalance } from '../models/userLevelBalance.model'
import { injectable } from 'inversify'

/**
 * User service that handles storing and modifying user data.
 *
 * @class UserService
 */
@injectable()
export class UserService implements BaseService<User, string> {
  private userRepository = getRepository(User)
  private userBalanceRepository = getRepository(UserBalance)
  private userProfileRepository = getRepository(UserProfile)
  private userSettingsRepository = getRepository(UserSettings)
  private userFriendRepository = getRepository(UserFriend)
  private userFriendRequestRepository = getRepository(UserFriendRequest)

  public find () {
    return this.userRepository.find()
  }

  public async findById (id: string) {
    return this.userRepository.findOne(id, {
      relations: ['level', 'settings', 'balance', 'profile']
    })
  }

  public create (user: User) {
    user.dateCreated = new Date()
    return this.userRepository.save(user)
  }

  public update (_: string, user: User) {
    return this.userRepository.save(user)
  }

  public async delete (id: string) {
    const user = await this.userRepository.findOne(id, {
      relations: ['level', 'balance', 'settings', 'profile']
    })

    if (!user) {
      return
    }

    return this.userRepository.remove(user)
  }

  public async updateLevel (id: string, userLevelBalance: UserLevelBalance) {
    const user = await this.userRepository.findOne(id, {
      relations: ['level', 'balance']
    })

    if (!user) {
      return
    }

    const { balance, level } = userLevelBalance

    user.level.timestamp = new Date()
    user.level.level = level.level
    user.level.xp = level.xp

    if (balance) {
      user.balance.balance = balance.balance
      user.balance.netWorth = balance.netWorth
    }

    return this.userRepository.save(user)
  }

  public async updateBalance (id: string, userBalance: UserBalance) {
    return this.userBalanceRepository.update({ user: { id } }, userBalance)
  }

  public async findProfile (id: string) {
    return this.userProfileRepository.findOne({ where: { user: { id } } })
  }

  public async updateProfile (id: string, userProfile: UserProfile) {
    return this.userProfileRepository.update({ user: { id } }, userProfile)
  }

  public async updateSettings (id: string, userSettings: UserSettings) {
    return this.userSettingsRepository.update({ user: { id } }, userSettings)
  }

  public async findSettings (id: string) {
    return this.userSettingsRepository.findOne({ where: { user: { id } } })
  }

  public async findFriendRequests (id: string, type: 'incoming' | 'outgoing' = 'incoming') {
    return this.userFriendRequestRepository.createQueryBuilder('request')
    .leftJoin('request.user', 'sender')
    .leftJoin('request.receiver', 'receiver')
    .where(`${type === 'incoming' ? 'sender' : 'receiver'}.id = :id`, { id })
    .getMany()
  }

  public async findFriendRequestByUserId (id: string, userId: string) {
    return this.userFriendRequestRepository.createQueryBuilder('request')
    .leftJoin('request.user', 'sender')
    .leftJoin('request.receiver', 'receiver')
    .where('sender.id = :id and receiver.id = :userId', { id, userId })
    .orWhere('sender.id = :userId and receiver.id = :id', { id, userId })
    .getOne()
  }

  public async searchFriendRequests (
    id: string,
    skip: number = 0,
    take: number = 10,
    userId?: string,
    name?: string,
    type: 'incoming' | 'outgoing' = 'incoming'
  ) {
    const queryBuilder = this.userFriendRequestRepository.createQueryBuilder('request')

    const userType = type === 'incoming' ? 'receiver' : 'user'
    const otherUserType = type === 'outgoing' ? 'receiver' : 'user'

    queryBuilder.innerJoin(`request.${userType}`, 'user').where('user.id = :id', { id })
    queryBuilder.innerJoin(`request.${otherUserType}`, 'other')

    if (userId) {
      queryBuilder.andWhere(`other.id LIKE :userId`, { userId: `%${userId.toLowerCase()}%` })
    }

    if (name) {
      queryBuilder.andWhere(`other.name LIKE :name`, { name: `%${name.toLowerCase()}%` })
    }

    queryBuilder.skip(skip)
    queryBuilder.take(take)

    return queryBuilder.getMany()
  }

  public async createFriendRequest (
    id: string,
    friendRequest: UserFriendRequest
  ) {
    // Creating a friend request is a three step process:
    // 1) Check if other user already sent a friend request.
    //    This is a completely valid and possible scenario.
    // 2) Check if the users are already friends.
    // 3) Save the friend request object.

    if (id === friendRequest.receiver.id) {
      return
    }

    let existingFriend = await this.userFriendRepository.findOne({
      where: { user: { id }, friend: { id: friendRequest.receiver.id } },
      relations: ['user', 'friend']
    })

    if (!existingFriend) {
      existingFriend = await this.userFriendRepository.findOne({
        where: { friend: { id }, user: { id: friendRequest.receiver.id } },
        relations: ['user', 'friend']
      })
    }

    if (existingFriend) {
      return
    }

    friendRequest.timestamp = new Date()

    return this.userFriendRequestRepository.save(friendRequest)
  }

  public async deleteFriendRequest (_: string, requestId: number) {
    const friendRequest = await this.userFriendRequestRepository.findOne({
      where: { id: requestId }
    })

    if (!friendRequest) {
      return
    }

    return this.userFriendRequestRepository.remove(friendRequest)
  }

  public async findFriends (id: string) {
    const results: UserFriend[] = []
    const friends = await this.userFriendRepository.find({
      where: { user: { id } },
      relations: ['friend']
    })
    const otherFriends = await this.userFriendRepository.find({
      where: { friend: { id } },
      relations: ['user']
    })

    return results.concat(friends, otherFriends)
  }

  public async searchFriends (
    id: string,
    skip: number = 0,
    take: number = 10,
    userId?: string,
    name?: string
  ) {
    let acceptedFriends: UserFriend[] = []
    let requestedFriends: UserFriend[] = []

    const query1: FindManyOptions<UserFriend> = {
      skip,
      take,
      relations: ['user', 'friend'],
      where: {}
    }

    const userObj1 = { friend: { id } }

    query1.where = userObj1

    if (userId) {
      const likeUserId = Like(`%${userId}%`)
      const whereUserId = { user: { id: likeUserId } }
      query1.where = { ...query1.where, ...whereUserId }
    }

    if (name) {
      const likeName = Like(`%${name}%`)
      const whereName = { user: { name: likeName } }
      query1.where = { ...query1.where, ...whereName }
    }

    acceptedFriends = await this.userFriendRepository.find(query1)

    const query2: FindManyOptions<UserFriend> = {
      skip,
      take,
      relations: ['user', 'friend'],
      where: {}
    }

    const userObj2 = { user: { id } }

    query2.where = userObj2

    if (userId) {
      const likeUserId = Like(`%${userId}%`)
      const whereUserId = { friend: { id: likeUserId } }
      query2.where = { ...query2.where, ...whereUserId }
    }

    if (name) {
      const likeName = Like(`%${name}%`)
      const whereName = { friend: { name: likeName } }
      query2.where = { ...query2.where, ...whereName }
    }

    requestedFriends = await this.userFriendRepository.find(query2)

    return acceptedFriends.concat(requestedFriends)
  }

  public async findFriendById (_: string, friendId: number) {
    return this.userFriendRepository.findOne(friendId)
  }

  public async addFriend (id: string, friend: UserFriend) {
    // Adding a friend consists of three steps:
    // 1) Delete the existing friend request, assuming it exists.
    //    The developer shouldn't manually delete an accepted friend request, only denied ones.
    // 2) Check if the other user already added them as a friend
    //    If this is true, then the developer is probably doing something wrong.
    // 3) Save the friend object.
    let friendRequest = await this.userFriendRequestRepository.findOne({
      where: { receiver: { id }, user: { id: friend.user.id } },
      relations: ['user', 'receiver']
    })

    if (friendRequest) {
      await this.userFriendRequestRepository.remove(friendRequest)
    }

    const existingFriend = await this.userFriendRepository.findOne({
      where: { user: { id: friend.user.id }, friend: { id } },
      relations: ['friend', 'user']
    })

    if (existingFriend) {
      return
    }

    friend.dateAdded = new Date()

    return this.userFriendRepository.save(friend)
  }

  public async deleteFriend (_: string, friendId: number) {
    const friend = await this.userFriendRepository.findOne(friendId)

    if (!friend) {
      return
    }

    return this.userFriendRepository.remove(friend)
  }
}
