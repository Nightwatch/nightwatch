import {
  User,
  UserBalance,
  UserProfile,
  UserSettings,
  UserFriend,
  UserFriendRequest,
  GuildUserMessage,
  GuildUser
} from '../../../db'
import { getRepository, Brackets } from 'typeorm'
import { UserLevelBalance } from '../models'
import { injectable } from 'inversify'
import { UserService as IUserService } from '../interfaces'

/**
 * User service that handles storing and modifying user data.
 */
@injectable()
export class UserService implements IUserService {
  private readonly userRepository = getRepository(User)
  private readonly userBalanceRepository = getRepository(UserBalance)
  private readonly userProfileRepository = getRepository(UserProfile)
  private readonly userSettingsRepository = getRepository(UserSettings)
  private readonly userFriendRepository = getRepository(UserFriend)
  private readonly userFriendRequestRepository = getRepository(
    UserFriendRequest
  )
  private readonly guildUserMessageRepository = getRepository(GuildUserMessage)
  private readonly guildUserRepository = getRepository(GuildUser)

  public find() {
    return this.userRepository.find()
  }

  public async findById(id: string) {
    return this.userRepository.findOneOrFail(id, {
      relations: ['level', 'settings', 'balance', 'profile']
    })
  }

  public async create(user: User) {
    const existing = await this.userRepository.findOne(user.id)

    if (existing) {
      return existing
    }

    user.dateCreated = new Date()
    return this.userRepository.save(user)
  }

  public async update(_: string, user: User) {
    return this.userRepository.save(user)
  }

  public async delete(id: string) {
    const user = await this.userRepository.findOne(id, {
      relations: ['level', 'balance', 'settings', 'profile']
    })

    if (!user) {
      return
    }

    await this.userRepository.remove(user)
  }

  public async updateLevel(id: string, userLevelBalance: UserLevelBalance) {
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

  public async updateBalance(id: string, userBalance: UserBalance) {
    const dbValue = this.userBalanceRepository.findOne({user: {id}})
    return this.userBalanceRepository.save({...dbValue, ...userBalance})
  }

  public async findProfile(id: string) {
    return this.userProfileRepository.findOne({ where: { user: { id } } })
  }

  public async updateProfile(id: string, userProfile: UserProfile) {
    const dbValue = this.userProfileRepository.findOne({user: {id}})
    return this.userProfileRepository.save({...dbValue, ...userProfile})
  }

  public async updateSettings(id: string, userSettings: UserSettings) {
    const dbValue = this.userSettingsRepository.findOne({user: {id}})
    return this.userSettingsRepository.save({...dbValue, ...userSettings})
  }

  public async findSettings(id: string) {
    return this.userSettingsRepository.findOne({ where: { user: { id } } })
  }

  public async findFriendRequests(
    id: string,
    type: 'incoming' | 'outgoing' = 'incoming'
  ) {
    return this.userFriendRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.sender', 'sender')
      .leftJoinAndSelect('request.receiver', 'receiver')
      .where(`${type === 'incoming' ? 'sender' : 'receiver'}.id = :id`, { id })
      .getMany()
  }

  public async findFriendRequestByUserId(id: string, userId: string) {
    return this.userFriendRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.sender', 'sender')
      .leftJoinAndSelect('request.receiver', 'receiver')
      .where('sender.id = :id and receiver.id = :userId', { id, userId })
      .orWhere('sender.id = :userId and receiver.id = :id', { id, userId })
      .getOne()
  }

  public async searchFriendRequests(
    id: string,
    skip: number = 0,
    take: number = 10,
    userId?: string,
    name?: string,
    type: 'incoming' | 'outgoing' = 'incoming'
  ) {
    const queryBuilder = this.userFriendRequestRepository.createQueryBuilder(
      'request'
    )

    const userType = type === 'incoming' ? 'receiver' : 'sender'
    const otherUserType = type === 'outgoing' ? 'receiver' : 'sender'

    queryBuilder
      .innerJoinAndSelect(`request.${userType}`, 'user')
      .where('user.id = :id', { id })
    queryBuilder.innerJoinAndSelect(`request.${otherUserType}`, 'other')

    if (userId) {
      queryBuilder.andWhere(`other.id LIKE :userId`, {
        userId: `%${userId.toLowerCase()}%`
      })
    }

    if (name) {
      queryBuilder.andWhere(`other.name LIKE :name`, {
        name: `%${name.toLowerCase()}%`
      })
    }

    queryBuilder.skip(skip)
    queryBuilder.take(take)

    return queryBuilder.getMany()
  }

  public async createFriendRequest(_: string, request: UserFriendRequest) {
    request.timestamp = new Date()

    return this.userFriendRequestRepository.save(request)
  }

  public async deleteFriendRequest(id: string, userId: string) {
    const friendRequest = await this.userFriendRequestRepository
      .createQueryBuilder('request')
      .leftJoin('request.sender', 'sender')
      .leftJoin('request.receiver', 'receiver')
      .where('sender.id = :id and receiver.id = :userId', { id, userId })
      .orWhere('sender.id = :userId and receiver.id = :id', { id, userId })
      .getOne()

    if (!friendRequest) {
      return
    }

    await this.userFriendRequestRepository.remove(friendRequest)
  }

  public async findFriends(id: string) {
    return this.userFriendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user', 'user')
      .leftJoinAndSelect('friend.friend', 'other')
      .where('user.id = :id', { id })
      .orWhere('other.id = :id', { id })
      .getMany()
  }

  public async findFriendByUserId(id: string, userId: string) {
    return this.userFriendRepository
      .createQueryBuilder('friend')
      .innerJoinAndSelect('friend.user', 'user')
      .innerJoinAndSelect('friend.friend', 'other')
      .where('user.id = :id and other.id = :userId', { id, userId })
      .orWhere('user.id = :userId and other.id = :id', { id, userId })
      .getOne()
  }

  public async searchFriends(
    id: string,
    skip: number = 0,
    take: number = 10,
    userId?: string,
    name?: string
  ) {
    const queryBuilder = this.userFriendRepository
      .createQueryBuilder('friend')
      .innerJoinAndSelect('friend.user', 'user')
      .innerJoinAndSelect('friend.friend', 'other')
      .where(
        new Brackets(qb => {
          qb.where('user.id = :id', { id }).orWhere('other.id = :id', { id })
        })
      )

    if (userId || name) {
      if (userId) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('other.id LIKE :userId', {
              userId: `%${userId.toLowerCase()}%`
            }).orWhere('user.id LIKE :userId', {
              userId: `%${userId.toLowerCase()}%`
            })
          })
        )
      }
      if (name) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('other.name LIKE :name', {
              name: `%${name.toLowerCase()}%`
            }).orWhere('user.name LIKE :name', {
              name: `%${name.toLowerCase()}%`
            })
          })
        )
      }
    }

    queryBuilder.skip(skip)
    queryBuilder.take(take)

    return queryBuilder.getMany()
  }

  public async addFriend(id: string, friend: UserFriend) {
    // Adding a friend consists of three steps:
    // 1) Delete the existing friend request, assuming it exists.
    //    The developer shouldn't manually delete an accepted friend request, only denied ones.
    // 2) Check if the other user already added them as a friend
    //    If this is true, then the developer is probably doing something wrong.
    // 3) Save the friend object.
    const friendRequest = await this.userFriendRequestRepository.findOne({
      where: { receiver: { id }, user: { id: friend.user.id } },
      relations: ['sender', 'receiver']
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

  public async deleteFriend(id: string, userId: string) {
    const friend = await this.userFriendRepository
      .createQueryBuilder('friend')
      .innerJoin('friend.user', 'user')
      .innerJoin('friend.friend', 'other')
      .where('user.id = :id and other.id = :userId', { id, userId })
      .orWhere('user.id = :userId and other.id = :id', { id, userId })
      .getOne()

    if (!friend) {
      return
    }

    await this.userFriendRepository.remove(friend)
  }

  public async findMessages(id: string) {
    return this.guildUserMessageRepository.find({where: {user: {id}}, relations: ['guild']})
  }

  public async findGuilds(id: string) {
    const results = await this.guildUserRepository.find({where: {user: {id}}, relations: ['guild', 'user']})
    return results.map(x => x.guild!)
  }
}
