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
import { Events } from '../constants'
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
 * @class UserController
 */
@controller('/api/users')
export class UserController implements BaseController<User, string> {
  @inject(Types.UserService) private userService: UserService
  @inject(Types.SocketService) private socketService: SocketService

  /**
   * Gets all users from the database, excluding most user information.
   *
   * GET /
   * @returns Promise<User[]>
   * @memberof UserController
   */
  @httpGet('/')
  async find () {
    return this.userService.find()
  }

  /**
   * Gets a user by their ID, including all user information.
   *
   * GET /:id
   * @param {string} id The ID of the user.
   * @returns Promise<User | undefined>
   * @memberof UserController
   */
  @httpGet('/:id')
  async findById (
    @requestParam('id') id: string,
    @response() response: Response
  ) {
    const user = await this.userService.findById(id)

    if (!user) {
      response.sendStatus(404)
      return
    }

    return user
  }

  /**
   * Creates a user.
   *
   * POST /
   * @param {Request} request The request contained a `User` object.
   * @returns Promise<User>
   * @memberof UserController
   */
  @httpPost('/')
  async create (@requestBody() user: User, @response() res: Response) {
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
    await this.userService.create(user)
    this.socketService.send(Events.user.created, user)
    res.sendStatus(201)
  }

  /**
   * Hard deletes a user.
   *
   * DELETE /:id
   * @param {string} id The ID of the user.
   * @returns Promise<User | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id')
  async deleteById (@requestParam('id') id: string, @response() res: Response) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.delete(id)
    this.socketService.send(Events.user.deleted, id)
  }

  /**
   * Updates a user by ID.
   *
   * PUT /:id
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `User` object.
   * @returns Promise<User>
   * @memberof UserController
   */
  @httpPut('/:id')
  async updateById (@requestParam('id') id: string, @requestBody() user: User, @response() res: Response) {
    const userExists = await this.userService.findById(id)
    if (!userExists) {
      res.sendStatus(404)
      return
    }
    await this.userService.update(id, user)
    this.socketService.send(Events.user.updated, user)
  }

  /**
   * Updates a user's level by ID.
   *
   * PUT /:id/level
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserLevelBalance` object.
   * @returns Promise<User | undefined>
   * @memberof UserController
   */
  @httpPut('/:id/level')
  async updateLevel (
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
    this.socketService.send(Events.user.levelUpdated, levelBalance)
  }

  /**
   * Updates a user's balance by ID.
   *
   * PUT /:id/balance
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserBalance` object.
   * @returns Promise<UpdateResult>
   * @memberof UserController
   */
  @httpPut('/:id/balance')
  async updateBalance (
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
    this.socketService.send(Events.user.balanceUpdated, balance)
  }

  /**
   * Transfers a certain amount of a user's credits to another user.
   *
   * PUT /:id/balance/transfer/:receiverId
   * @param {string} id The ID of the user losing credits.
   * @param {string} receiverId The ID of the user gaining credits.
   * @param {Request} request The request to the server.
   * @param {Response} response The response to the client.
   * @returns Promise<{transferFromResponse: UpdateResult, transferToResponse: UpdateResult} | undefined>
   * @memberof UserController
   */
  @httpPut('/:id/balance/transfer/:receiverId')
  async transferBalance (
    @requestParam('id') id: string,
    @requestParam('receiverId') receiverId: string,
    @requestBody() balance: { amount: number },
    @response() response: Response
  ) {
    const amount = balance.amount

    if (receiverId === id) {
      response.sendStatus(400)
      return
    }

    const fromUser = await this.userService.findById(id)
    const toUser = await this.userService.findById(receiverId)

    if (!fromUser || !toUser) {
      response.sendStatus(404)
      return
    }

    if (amount < 1) {
      response.status(400).send('Amount must be greater than 0')
    }

    if (fromUser.balance.balance < amount) {
      response.status(400).send('Insufficient credits')
      return
    }

    fromUser.balance.balance -= amount
    fromUser.balance.netWorth -= amount
    toUser.balance.balance += amount
    toUser.balance.netWorth += amount

    await this.userService.updateBalance(
      id,
      fromUser.balance
    )
    await this.userService.updateBalance(
      receiverId,
      toUser.balance
    )
  }

  /**
   * Gets the profile for a user by ID.
   * @param {string} id The ID of the user.
   * @returns Promise<UserProfile[]>
   * @memberof UserController
   */
  @httpGet('/:id/profile')
  async findProfileById (@requestParam('id') id: string, @response() res: Response) {
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserProfile` object.
   * @returns Promise<UpdateResult>
   * @memberof UserController
   */
  @httpPut('/:id/profile')
  async updateProfile (
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
    this.socketService.send(Events.user.profileUpdated, profile)
  }

  /**
   * Gets the settings for a user.
   * @param {string} id The ID of the user.
   * @returns Promise<UserSettings[]>
   * @memberof UserController
   */
  @httpGet('/:id/settings')
  async findSettingsById (@requestParam('id') id: string, @response() res: Response) {
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
   * @param {string} id The ID of the user.
   * @param {Request} request The request containing a `UserSettings` object.
   * @returns Promise<UpdateResult>
   * @memberof UserController
   */
  @httpPut('/:id/settings')
  async updateSettings (
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
    this.socketService.send(Events.user.settingsUpdated, settings)
  }

  /**
   * Gets all friend requests for a user.
   *
   * GET /:id/friends/requests
   * @param {string} id
   * @param {('incoming' | 'outgoing')} [type] Optional filter to only get incoming or outgoing friend requests.
   * @returns Map of incoming and outgoing friend requests.
   * @memberof UserController
   */
  @httpGet('/:id/friends/requests')
  async findFriendRequests (
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
   * @param {string} id
   * @param {number} [skip]
   * @param {number} [take]
   * @returns Promise<UserFriendRequest[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends/requests/search')
  async searchFriendRequests (
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
   * @param {string} id
   * @param {string} userId
   * @returns Friend request
   * @memberof UserController
   */
  @httpGet('/:id/friends/requests/:userId')
  async findFriendRequestByUserId (
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
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends/requests/:userId')
  async createFriendRequest (
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
    const sentRequest = await this.userService.findFriendRequestByUserId(id, userId)
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
    await this.userService.createFriendRequest(
      id,
      request
    )
    this.socketService.send(Events.user.friend.request.created, request)
    res.sendStatus(201)
  }

  /**
   * Deletes a friend request.
   *
   * DELETE /:id/friends/requests/:userId
   * @param {string} id
   * @param {number} userId
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/requests/:userId')
  async deleteFriendRequest (
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
    this.socketService.send(Events.user.friend.request.deleted, {
      userId: id,
      otherUserId: userId
    })
  }

  /**
   * Gets all friends for a user.
   *
   * GET /:id/friends
   * @param {string} id
   * @returns Promise<UserFriend[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends')
  async findFriends (@requestParam('id') id: string, @response() res: Response) {
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
   * @param {string} id
   * @param {number} [skip]
   * @param {number} [take]
   * @returns Promise<UserFriend[]>
   * @memberof UserController
   */
  @httpGet('/:id/friends/search')
  async searchFriends (
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
   * @param {string} id
   * @param {string} userId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpGet('/:id/friends/:userId')
  async findFriendByUserId (
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
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends/:userId')
  async addFriend (
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
    const friendRequest = await this.userService.searchFriendRequests(id, 0, 1, userId, undefined, 'incoming')
    if (!friendRequest[0]) {
      res.sendStatus(400)
      return
    }
    const userFriend = new UserFriend()
    userFriend.user = userExists
    userFriend.friend = otherUserExists
    await this.userService.addFriend(id, userFriend)
    this.socketService.send(Events.user.friend.created, userFriend)
    res.sendStatus(201)
  }

  /**
   * Deletes a friend.
   *
   * DELETE /:id/friends/:userId
   * @param {string} id
   * @param {string} userId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/:userId')
  async removeFriend (
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
    this.socketService.send(Events.user.friend.deleted, {
      userId: id,
      otherUserId: userId
    })
  }
}
