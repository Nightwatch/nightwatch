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
import { Types, Events } from '../constants'
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
import { BaseController } from '../interfaces/BaseController'
import { validate } from 'class-validator'
import { UserLevelBalance } from '../models'

/**
 * The user controller. Contains all endpoints for handling users and user data.
 *
 * /api/users
 * @class UserController
 */
@controller('/api/users')
export class UserController implements BaseController<User, string> {
  constructor (
    @inject(Types.UserService) private userService: UserService,
    @inject(Types.SocketService) private socketService: SocketService
  ) {}

  /**
   * Gets all users from the database, excluding most user information.
   *
   * GET /
   * @returns Promise<User[]>
   * @memberof UserController
   */
  @httpGet('/')
  async getAll () {
    return this.userService.getAll()
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
    if (await this.userService.findById(user.id)) {
      res.status(409).send('User already exists')
    }
    const createdUser = await this.userService.create(user)
    this.socketService.send(Events.user.created, createdUser)

    return createdUser
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
  async deleteById (@requestParam('id') id: string) {
    const deleteResponse = await this.userService.delete(id)
    this.socketService.send(Events.user.deleted, id)

    return deleteResponse
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
  async updateById (@requestParam('id') id: string, @requestBody() user: User) {
    const updateResponse = await this.userService.update(id, user)
    this.socketService.send(Events.user.updated, updateResponse)

    return updateResponse
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
    @requestBody() levelBalance: UserLevelBalance
  ) {
    const levelResponse = await this.userService.updateLevel(id, levelBalance)
    this.socketService.send(Events.user.levelUpdated, levelResponse)

    return levelResponse
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
    @requestBody() balance: UserBalance
  ) {
    const balanceResponse = await this.userService.updateBalance(id, balance)
    this.socketService.send(Events.user.balanceUpdated, balanceResponse)

    return balanceResponse
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

    const fromUser = await this.userService.findById(id)
    const toUser = await this.userService.findById(receiverId)

    if (!fromUser || !toUser) {
      response.status(400).send('User not found')
      return
    }

    if (fromUser === toUser) {
      response.status(400).send('Sender and receiver are the same')
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

    const transferFromResponse = await this.userService.updateBalance(
      id,
      fromUser.balance
    )
    const transferToResponse = await this.userService.updateBalance(
      receiverId,
      toUser.balance
    )

    return {
      transferFromResponse,
      transferToResponse
    }
  }

  /**
   * Gets the profile for a user by ID.
   * @param {string} id The ID of the user.
   * @returns Promise<UserProfile[]>
   * @memberof UserController
   */
  @httpGet('/:id/profile')
  async getProfileById (@requestParam('id') id: string) {
    return this.userService.getProfile(id)
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
    @requestBody() profile: UserProfile
  ) {
    const profileResponse = await this.userService.updateProfile(id, profile)
    this.socketService.send(Events.user.profileUpdated, profileResponse)

    return profileResponse
  }

  /**
   * Gets the settings for a user.
   * @param {string} id The ID of the user.
   * @returns Promise<UserSettings[]>
   * @memberof UserController
   */
  @httpGet('/:id/settings')
  async getSettingsById (@requestParam('id') id: string) {
    return this.userService.getSettings(id)
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
    @requestBody() settings: UserSettings
  ) {
    const settingsResponse = await this.userService.updateSettings(id, settings)
    this.socketService.send(Events.user.settingsUpdated, settingsResponse)

    return settingsResponse
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
  async getFriendRequests (
    @requestParam('id') id: string,
    @queryParam('type') type?: 'incoming' | 'outgoing'
  ) {
    return this.userService.getFriendRequests(id, type)
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
    @queryParam('skip') skip?: number,
    @queryParam('take') take?: number,
    @queryParam('userId') userId?: string,
    @queryParam('name') name?: string,
    @queryParam('type') type?: 'incoming' | 'outgoing'
  ) {
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
   * Creates a friend request.
   *
   * POST /:id/friends/requests
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends/requests')
  async createFriendRequest (
    @requestParam('id') id: string,
    @requestBody() friendRequest: UserFriendRequest
  ) {
    const response = await this.userService.createFriendRequest(
      id,
      friendRequest
    )
    this.socketService.send(Events.user.friend.request.created, response)

    return response
  }

  /**
   * Deletes a friend request.
   *
   * DELETE /:id/friends/requests/:requestId
   * @param {string} id
   * @param {number} requestId
   * @returns Promise<UserFriendRequest | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/requests/:requestId')
  async deleteFriendRequest (
    @requestParam('id') id: string,
    @requestParam('requestId') requestId: number
  ) {
    const response = await this.userService.deleteFriendRequest(id, requestId)
    this.socketService.send(Events.user.friend.request.deleted, {
      userId: id,
      requestId
    })

    return response
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
  async getFriends (@requestParam('id') id: string) {
    return this.userService.getFriends(id)
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
    @queryParam('skip') skip?: number,
    @queryParam('take') take?: number,
    @queryParam('userId') userId?: string,
    @queryParam('name') name?: string
  ) {
    return this.userService.searchFriends(id, skip, take, userId, name)
  }

  /**
   * Gets a user's friend by a database object ID.
   *
   * GET /:id/friends/:friendId
   * @param {string} id
   * @param {number} friendId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpGet('/:id/friends/:friendId')
  async getFriendById (
    @requestParam('id') id: string,
    @requestParam('friendId') friendId: number
  ) {
    return this.userService.getFriendById(id, friendId)
  }

  /**
   * Creates a friend and deletes the related friend request.
   *
   * POST /:id/friends
   * @param {string} id
   * @param {Request} request
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpPost('/:id/friends')
  async addFriend (
    @requestParam('id') id: string,
    @requestBody() friend: UserFriend
  ) {
    const response = await this.userService.addFriend(id, friend)
    this.socketService.send(Events.user.friend.created, response)

    return response
  }

  /**
   * Deletes a friend.
   *
   * DELETE /:id/friends/:friendId
   * @param {string} id
   * @param {number} friendId
   * @returns Promise<UserFriend | undefined>
   * @memberof UserController
   */
  @httpDelete('/:id/friends/:friendId')
  async removeFriend (
    @requestParam('id') id: string,
    @requestParam('friendId') friendId: number
  ) {
    const response = await this.userService.deleteFriend(id, friendId)
    this.socketService.send(Events.user.friend.deleted, {
      userId: id,
      friendId
    })

    return response
  }
}
