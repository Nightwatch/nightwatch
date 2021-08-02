import { Response } from 'express'
import {
  controller,
  httpGet,
  httpDelete,
  httpPut,
  httpPost,
  requestParam,
  response,
  queryParam,
  requestBody
} from 'inversify-express-utils'
import { inject } from 'inversify'
import {
  UserEvent,
  UserBalanceEvent,
  UserFriendEvent,
  UserFriendRequestEvent,
  UserLevelEvent,
  UserProfileEvent,
  UserSettingsEvent
} from '../constants'
import { UserService } from '../services/user'
import { SocketService } from '../services/socket'
import {
  User,
  UserBalance,
  UserProfile,
  UserFriend,
  UserSettings,
  UserFriendRequest
} from '../../../db'
import { BaseController } from '../interfaces/base-controller'
import { validate } from 'class-validator'
import { UserLevelBalance } from '../models'
import { Types } from '../../../common'

/**
 * The user controller. Contains all endpoints for handling users and user data.
 *
 * /api/users
 */
@controller('/api/users')
export class UserController implements BaseController<User, string> {
  @inject(Types.UserService) private readonly userService: UserService
  @inject(Types.SocketService) private readonly socketService: SocketService

  /**
   * Gets all users from the database, excluding most user information.
   *
   * GET /
   * @returns Promise<User[]>
   */
  @httpGet('/')
  public async find() {
    return this.userService.find()
  }

  /**
   * Gets a user by their ID, including all user information.
   *
   * GET /:id
   * @returns Promise<User | undefined>
   */
  @httpGet('/:id')
  public async findById(
    @requestParam('id') id: string,
    @response() res: Response
  ) {
    const user = await this.userService.findById(id)

    if (!user) {
      res.sendStatus(404)
      return
    }

    return user
  }

  /**
   * Creates a user.
   *
   * POST /
   * @returns Promise<User>
   */
  @httpPost('/')
  public async create(@requestBody() user: User, @response() res: Response) {
    const errors = await validate(user, { validationError: { target: false } })
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }
    const existingUser = await this.userService.findById(user.id)
    if (existingUser) {
      res.status(409).send('User already exists')
      return
    }
    const result = await this.userService.create(user)
    this.socketService.send(UserEvent.USER_CREATE, user)
    return result
  }

  /**
   * Hard deletes a user.
   *
   * DELETE /:id
   * @returns Promise<User | undefined>
   */
  @httpDelete('/:id')
  public async deleteById(
    @requestParam('id') id: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.delete(id)
    this.socketService.send(UserEvent.USER_DELETE, id)
  }

  /**
   * Updates a user by ID.
   *
   * PUT /:id
   * @returns Promise<User>
   */
  @httpPut('/:id')
  public async updateById(
    @requestParam('id') id: string,
    @requestBody() user: User,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.update(id, user)
    this.socketService.send(UserEvent.USER_UPDATE, user)
  }

  /**
   * Updates a user's level by ID.
   *
   * PUT /:id/level
   * @returns Promise<User | undefined>
   */
  @httpPut('/:id/level')
  public async updateLevel(
    @requestParam('id') id: string,
    @requestBody() levelBalance: UserLevelBalance,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.updateLevel(id, levelBalance)
    this.socketService.send(UserLevelEvent.USER_LEVEL_UPDATE, levelBalance)
  }

  /**
   * Updates a user's balance by ID.
   *
   * PUT /:id/balance
   * @returns Promise<UpdateResult>
   */
  @httpPut('/:id/balance')
  public async updateBalance(
    @requestParam('id') id: string,
    @requestBody() balance: UserBalance,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.updateBalance(id, balance)
    this.socketService.send(UserBalanceEvent.USER_BALANCE_UPDATE, balance)
  }

  /**
   * Transfers a certain amount of a user's credits to another user.
   *
   * PUT /:id/balance/transfer/:receiverId
   * @returns Promise<{transferFromResponse: UpdateResult, transferToResponse: UpdateResult} | undefined>
   */
  @httpPut('/:id/balance/transfer/:receiverId')
  public async transferBalance(
    @requestParam('id') id: string,
    @requestParam('receiverId') receiverId: string,
    @requestBody() balance: { readonly amount: number },
    @response() res: Response
  ) {
    const amount = balance.amount

    if (receiverId === id) {
      res.sendStatus(400)
      return
    }

    const fromUser = await this.userService.findById(id)
    const toUser = await this.userService.findById(receiverId)

    if (!fromUser || !toUser) {
      res.sendStatus(404)
      return
    }

    if (amount < 1) {
      res.status(400).send('Amount must be greater than 0')
    }

    if (fromUser.balance.balance < amount) {
      res.status(400).send('Insufficient credits')
      return
    }

    fromUser.balance.balance -= amount
    fromUser.balance.netWorth -= amount
    toUser.balance.balance += amount
    toUser.balance.netWorth += amount

    await this.userService.updateBalance(id, fromUser.balance)
    await this.userService.updateBalance(receiverId, toUser.balance)
  }

  /**
   * Gets the profile for a user by ID.
   * @returns Promise<UserProfile[]>
   */
  @httpGet('/:id/profile')
  public async findProfileById(
    @requestParam('id') id: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findProfile(id)
  }

  /**
   * Updates a user's profile by ID.
   *
   * PUT /:id/profile
   * @returns Promise<UpdateResult>
   */
  @httpPut('/:id/profile')
  public async updateProfile(
    @requestParam('id') id: string,
    @requestBody() profile: UserProfile,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }

    await this.userService.updateProfile(id, profile)
    this.socketService.send(UserProfileEvent.USER_PROFILE_UPDATE, profile)
  }

  /**
   * Gets the settings for a user.
   * @returns Promise<UserSettings[]>
   */
  @httpGet('/:id/settings')
  public async findSettingsById(
    @requestParam('id') id: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findSettings(id)
  }

  /**
   * Updates a user's settings by ID.
   *
   * PUT /:id/settings
   * @returns Promise<UpdateResult>
   */
  @httpPut('/:id/settings')
  public async updateSettings(
    @requestParam('id') id: string,
    @requestBody() settings: UserSettings,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.updateSettings(id, settings)
    this.socketService.send(UserSettingsEvent.USER_SETTINGS_UPDATE, settings)
  }

  /**
   * Gets all friend requests for a user.
   *
   * GET /:id/friends/requests
   * @returns Map of incoming and outgoing friend requests.
   */
  @httpGet('/:id/friends/requests')
  public async findFriendRequests(
    @requestParam('id') id: string,
    @response() res: Response,
    @queryParam('type') type?: 'incoming' | 'outgoing'
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findFriendRequests(id, type)
  }

  /**
   * Gets a paginated list of friend requests.
   *
   * GET /:id/friends/requests/search
   * @returns Promise<UserFriendRequest[]>
   */
  @httpGet('/:id/friends/requests/search')
  public async searchFriendRequests(
    @requestParam('id') id: string,
    @response() res: Response,
    @queryParam('skip') skip: number,
    @queryParam('take') take: number,
    @queryParam('userId') userId?: string,
    @queryParam('name') name?: string,
    @queryParam('type') type?: 'incoming' | 'outgoing'
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.searchFriendRequests(
      id,
      skip,
      take,
      userId,
      name,
      type
    )
  }

  /**
   * Finds a friend request sent to or by other user ID.
   *
   * GET /:id/friends/requests/:userId
   * @returns Friend request
   */
  @httpGet('/:id/friends/requests/:userId')
  public async findFriendRequestByUserId(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findFriendRequestByUserId(id, userId)
  }

  /**
   * Creates a friend request.
   *
   * POST /:id/friends/requests
   * @returns Promise<UserFriendRequest | undefined>
   */
  @httpPost('/:id/friends/requests/:userId')
  public async createFriendRequest(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    if (id === userId) {
      res.sendStatus(400)
      return
    }
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    const sentRequest = await this.userService.findFriendRequestByUserId(
      id,
      userId
    )
    if (sentRequest) {
      res.sendStatus(409)
      return
    }
    const friend = await this.userService.findFriendByUserId(id, userId)
    if (friend) {
      res.sendStatus(409)
      return
    }
    const request = new UserFriendRequest()
    request.sender = userExists
    request.receiver = otherUserExists
    await this.userService.createFriendRequest(id, request)
    this.socketService.send(
      UserFriendRequestEvent.USER_FRIEND_REQUEST_CREATE,
      request
    )
    res.sendStatus(201)
  }

  /**
   * Deletes a friend request.
   *
   * DELETE /:id/friends/requests/:userId
   * @returns Promise<UserFriendRequest | undefined>
   */
  @httpDelete('/:id/friends/requests/:userId')
  public async deleteFriendRequest(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    if (id === userId) {
      res.sendStatus(400)
      return
    }
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.deleteFriendRequest(id, userId)
    this.socketService.send(UserFriendRequestEvent.USER_FRIEND_REQUEST_DELETE, {
      userId: id,
      otherUserId: userId
    })
  }

  /**
   * Gets all friends for a user.
   *
   * GET /:id/friends
   * @returns Promise<UserFriend[]>
   */
  @httpGet('/:id/friends')
  public async findFriends(
    @requestParam('id') id: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findFriends(id)
  }

  /**
   * Gets a paginated list of friends for a user.
   *
   * GET /:id/friends/search
   * @returns Promise<UserFriend[]>
   */
  @httpGet('/:id/friends/search')
  public async searchFriends(
    @requestParam('id') id: string,
    @queryParam('skip') skip: number,
    @queryParam('take') take: number,
    @response() res: Response,
    @queryParam('userId') userId?: string,
    @queryParam('name') name?: string
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.searchFriends(id, skip, take, userId, name)
  }

  /**
   * Gets a user's friend by user ID.
   *
   * GET /:id/friends/:userId
   * @returns Promise<UserFriend | undefined>
   */
  @httpGet('/:id/friends/:userId')
  public async findFriendByUserId(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    return this.userService.findFriendByUserId(id, userId)
  }

  /**
   * Creates a friend and deletes the related friend request.
   *
   * POST /:id/friends/:userId
   * @returns Promise<UserFriend | undefined>
   */
  @httpPost('/:id/friends/:userId')
  public async addFriend(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    const friendRequest = await this.userService.searchFriendRequests(
      id,
      0,
      1,
      userId,
      undefined,
      'incoming'
    )
    if (!friendRequest[0]) {
      res.sendStatus(400)
      return
    }
    const userFriend = new UserFriend()
    userFriend.user = userExists
    userFriend.friend = otherUserExists
    await this.userService.addFriend(id, userFriend)
    this.socketService.send(UserFriendEvent.USER_FRIEND_CREATE, userFriend)
    res.sendStatus(201)
  }

  /**
   * Deletes a friend.
   *
   * DELETE /:id/friends/:userId
   * @returns Promise<UserFriend | undefined>
   */
  @httpDelete('/:id/friends/:userId')
  public async removeFriend(
    @requestParam('id') id: string,
    @requestParam('userId') userId: string,
    @response() res: Response
  ) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    const otherUserExists = await this.userService.findById(userId)
    if (!otherUserExists) {
      res.sendStatus(404)
      return
    }
    const friend = await this.userService.searchFriends(id, 0, 1, userId)
    if (!friend[0]) {
      res.sendStatus(400)
      return
    }
    await this.userService.deleteFriend(id, userId)
    this.socketService.send(UserFriendEvent.USER_FRIEND_DELETE, {
      userId: id,
      otherUserId: userId
    })
  }
}
