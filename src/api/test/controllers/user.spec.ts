/* tslint:disable:no-unused-expression */

import 'reflect-metadata'
import 'mocha'
import { expect } from 'chai'
import { createTestDatabaseConnection } from '..'
import { container } from '../../src/ioc/inversify.config'
import * as supertest from 'supertest'
import {
  User,
  UserVerification,
  UserSettings,
  UserReputation,
  UserProfile,
  UserLevel,
  UserBalance,
  UserFriendRequest,
  UserFriend
} from '../../../db'
import { getRepository, getConnection } from 'typeorm'
import {
  InversifyExpressServer,
  cleanUpMetadata
} from 'inversify-express-utils'
import * as bodyParser from 'body-parser'

describe('UserController', () => {
  let server: InversifyExpressServer
  let app: supertest.SuperTest<supertest.Test>

  before(async () => {
    await createTestDatabaseConnection()
    server = new InversifyExpressServer(container)
    server.setConfig(app => {
      app.use(bodyParser.json())
    })
    app = supertest(server.build())
  })

  afterEach(async () => {
    cleanUpMetadata()
    const connection = getConnection()
    await connection.dropDatabase()
    await connection.synchronize()
  })

  describe('find', () => {
    it('should get all users when no users exist', async () => {
      const response = await app.get('/api/users').expect(200)
      expect(response.body).to.not.be.null
      expect(response.body).to.have.lengthOf(0)
    })

    it('should get all users', async () => {
      const user = getTestUser('aaa', 'Test1')
      const user2 = getTestUser('bbb', 'Test2')
      const user3 = getTestUser('ccc', 'Test3')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const response = await app.get('/api/users').expect(200)

      expect(response.body).to.not.be.null
      expect(response.body).to.have.lengthOf(3)
    })
  })

  describe('findById', () => {
    it('should get a user by id', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      const response = await app.get('/api/users/asdf').expect(200)

      expect(response.body)
        .to.haveOwnProperty('id')
        .which.equals('asdf')
    })

    it('should return undefined on get by id for non existant id', async () => {
      const response = await app.get('/api/users/asdf').expect(404)

      expect(response.body).to.be.empty
    })
  })

  describe('create', () => {
    it('should create a user', async () => {
      const user = getTestUser('asdf', 'Test')

      const response = await app
        .post('/api/users')
        .send(user)
        .expect(200)

      expect(response.body)
        .to.haveOwnProperty('id')
        .which.equals('asdf')

      const allUserResponse = await getRepository(User).find()

      expect(allUserResponse)
        .to.be.instanceof(Array)
        .with.lengthOf(1)
    })

    it('should error if the same user is created twice', async () => {
      const user = getTestUser('asdf', 'Test')

      const response = await app
        .post('/api/users')
        .send(user)
        .expect(200)
      const response2 = await app
        .post('/api/users')
        .send(user)
        .expect(409)

      expect(response.body)
        .to.haveOwnProperty('id')
        .which.equals('asdf')
      expect(response2.text).to.contain('already exists')
      expect(response2.body).to.be.empty
    })
  })

  describe('deleteById', () => {
    it('should delete a user', async () => {
      const user = getTestUser('aaa', 'Test1')

      await getRepository(User).save(user)

      let allUsers = await getRepository(User).find()

      expect(allUsers)
        .to.be.instanceof(Array)
        .with.lengthOf(1)

      await app.delete('/api/users/aaa').expect(200)

      allUsers = await getRepository(User).find()

      expect(allUsers)
        .to.be.instanceof(Array)
        .with.lengthOf(0)
    })

    it('should fail to delete user not found', async () => {
      await app.delete('/api/users/doesnotexist').expect(404)
    })
  })

  describe('updateById', () => {
    it('should update a user', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.name = 'someOtherName'

      const response = await app
        .put('/api/users/asdf')
        .send(user)
        .expect(200)

      expect(response.body)
        .to.have.property('name')
        .which.equals('someOtherName')
    })

    it('should fail to update user not exists', async () => {
      const user = getTestUser('asdf', 'someName')

      const response = await app
        .put('/api/users/asdf')
        .send(user)
        .expect(404)

      expect(response.body).to.be.empty
    })
  })

  describe('updateLevel', () => {
    it('should update level', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.level.level = 2
      user.level.xp = 12

      await app
        .put('/api/users/asdf/level')
        .send({ level: user.level })
        .expect(200)
    })

    it('should update level and balance', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.level.level = 2
      user.level.xp = 12
      user.balance.balance = 100

      await app
        .put('/api/users/asdf/level')
        .send({ level: user.level, balance: user.balance })
        .expect(200)
    })

    it('should fail to update level for user not exists', async () => {
      const user = getTestUser('asdf', 'someName')

      user.level.level = 2
      user.level.xp = 12
      user.balance.balance = 100

      await app
        .put('/api/users/asdf/level')
        .send({ level: user.level, balance: user.balance })
        .expect(404)
    })
  })

  describe('updateBalance', () => {
    it('should update balance', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.balance.balance = 100

      await app
        .put('/api/users/asdf/balance')
        .send(user.balance)
        .expect(200)
    })

    it('should fail to update balance for user not exists', async () => {
      const user = getTestUser('asdf', 'someName')

      user.balance.balance = 100

      await app
        .put('/api/users/asdf/level')
        .send(user.balance)
        .expect(404)
    })
  })

  describe('transferBalance', () => {
    it('should transfer money from one user to another', async () => {
      const user = getTestUser('asdf', 'someName')
      const user2 = getTestUser('aaa', 'otherName')

      user.balance.balance = 100

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: 50 })
        .expect(200)
    })

    it('should fail to transfer balance user not exist', async () => {
      const user2 = getTestUser('aaa', 'otherName')

      await getRepository(User).save(user2)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: 50 })
        .expect(404)
    })

    it('should fail to transfer balance receiving user not exist', async () => {
      const user = getTestUser('asdf', 'someName')
      user.balance.balance = 100

      await getRepository(User).save(user)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: 50 })
        .expect(404)
    })

    it('should fail to transfer, user has no money', async () => {
      const user = getTestUser('asdf', 'someName')
      const user2 = getTestUser('aaa', 'otherName')

      user.balance.balance = 0

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: 50 })
        .expect(400)
    })

    it('should fail to transfer, not enough money', async () => {
      const user = getTestUser('asdf', 'someName')
      const user2 = getTestUser('aaa', 'otherName')

      user.balance.balance = 20

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: 50 })
        .expect(400)
    })

    it('should fail to transfer, invalid amount', async () => {
      const user = getTestUser('asdf', 'someName')
      const user2 = getTestUser('aaa', 'otherName')

      user.balance.balance = 20

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      await app
        .put('/api/users/asdf/balance/transfer/aaa')
        .send({ amount: -50 })
        .expect(400)
    })

    it('should fail to transfer, cant transfer to self', async () => {
      const user = getTestUser('asdf', 'someName')

      user.balance.balance = 100

      await getRepository(User).save(user)

      await app
        .put('/api/users/asdf/balance/transfer/asdf')
        .send({ amount: 50 })
        .expect(400)
    })
  })

  describe('findProfileById', () => {
    it('should find profile', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      await app.get('/api/users/asdf/profile').expect(200)
    })

    it('should fail to find profile user not exist', async () => {
      await app.get('/api/users/asdf/profile').expect(404)
    })
  })

  describe('updateProfile', () => {
    it('should update profile', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.profile.bio = 'Hello world'

      await app
        .put('/api/users/asdf/profile')
        .send(user.profile)
        .expect(200)
    })

    it('should fail to update profile user not exists', async () => {
      const user = getTestUser('asdf', 'someName')
      user.profile.bio = 'Hello world'

      await app
        .put('/api/users/asdf/profile')
        .send(user.profile)
        .expect(404)
    })
  })

  describe('findSettingsById', () => {
    it('should find settings', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      await app.get('/api/users/asdf/settings').expect(200)
    })

    it('should fail to find settings user not exist', async () => {
      await app.get('/api/users/asdf/settings').expect(404)
    })
  })

  describe('updateSettings', () => {
    it('should update settings', async () => {
      const user = getTestUser('asdf', 'someName')

      await getRepository(User).save(user)

      user.settings.directMessagesEnabled = false
      user.settings.levelsEnabled = true

      await app
        .put('/api/users/asdf/settings')
        .send(user.settings)
        .expect(200)
    })

    it('should fail to update settings user not exists', async () => {
      const user = getTestUser('asdf', 'someName')

      user.settings.directMessagesEnabled = false
      user.settings.levelsEnabled = true

      await app
        .put('/api/users/asdf/settings')
        .send(user.settings)
        .expect(404)
    })
  })

  describe('findFriendRequests', () => {
    it('should find incoming friend requests', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user
      friendRequest.user = user2

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get('/api/users/asdf/friends/requests?type=incoming')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should find outgoing friend requests', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user
      friendRequest.user = user2

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get('/api/users/asdf/friends/requests?type=outgoing')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should succeed to find friend requests if none exist', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      const response = await app
        .get('/api/users/asdf/friends/requests')
        .expect(200)

      expect(response.body).to.have.lengthOf(0)
    })

    it('should fail to find friend requests user not exist', async () => {
      await app.get('/api/users/asdf/friends/requests').expect(404)
    })
  })

  describe('searchFriendRequests', () => {
    it('should search sent friend requests', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user
      friendRequest.user = user2

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=0&take=10&type=outgoing'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search incoming friend requests', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user
      friendRequest.user = user2

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=0&take=10&type=incoming'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friend requests by id', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=0&take=10&type=outgoing&userId=bb'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friend requests by name', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=0&take=10&type=outgoing&name=ano'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friend requests with skip', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=1&take=10&type=outgoing'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friend requests with take', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      const friendRequest2 = new UserFriendRequest()
      friendRequest2.receiver = user3
      friendRequest2.user = user

      await getRepository(UserFriendRequest).save(friendRequest)
      await getRepository(UserFriendRequest).save(friendRequest2)

      const response = await app
        .get(
          '/api/users/asdf/friends/requests/search?skip=0&take=1&type=outgoing'
        )
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should succeed to search friend requests if none exist', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      const response = await app
        .get('/api/users/asdf/friends/requests/search?skip=0&take=10')
        .expect(200)

      expect(response.body).to.have.lengthOf(0)
    })

    it('should fail to search friend requests user not exist', async () => {
      await app
        .get('/api/users/asdf/friends/requests/search?skip=0&take=10')
        .expect(404)
    })
  })

  describe('createFriendRequest', () => {
    it('should create friend request', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(200)
    })

    it('should fail to create friend request, request already exists', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      await getRepository(UserFriendRequest).save(friendRequest)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(409)
    })

    it('should fail to create friend request, other sent them a request', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user
      friendRequest.user = user2

      await getRepository(UserFriendRequest).save(friendRequest)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(409)
    })

    it('should fail to create friend request, users are friends', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      await getRepository(UserFriend).save(friend)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(409)
    })

    it('should fail to create friend request user not exist', async () => {
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user2)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(404)
    })

    it('should fail to create friend request other user not exist', async () => {
      const user = getTestUser('asdf', 'otherName')

      await getRepository(User).save(user)

      await app.post('/api/users/asdf/friends/requests/aaaa').expect(404)
    })
  })

  describe('deleteFriendRequest', () => {
    it('should delete a friend request', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)

      const friendRequest = new UserFriendRequest()
      friendRequest.receiver = user2
      friendRequest.user = user

      await getRepository(UserFriendRequest).save(friendRequest)

      await app.delete('/api/users/asdf/friends/requests/aaaa').expect(200)
    })

    it('should fail to delete friend request user not found', async () => {
      const user = getTestUser('asdf', 'otherName')

      await getRepository(User).save(user)

      await app.delete('/api/users/asdf/friends/requests/aaaa').expect(404)
    })

    it('should fail to delete friend request other user not found', async () => {
      const user2 = getTestUser('aaaa', 'otherName')

      await getRepository(User).save(user2)

      await app.delete('/api/users/asdf/friends/requests/aaaa').expect(404)
    })
  })

  describe('findFriends', () => {
    it('should find friends', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app.get('/api/users/asdf/friends').expect(200)

      expect(response.body).to.have.lengthOf(2)
    })

    it('should succeed to find friends if none exist', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      const response = await app.get('/api/users/asdf/friends').expect(200)

      expect(response.body).to.have.lengthOf(0)
    })

    it('should fail to find friends user not exist', async () => {
      await app.get('/api/users/asdf/friends').expect(404)
    })
  })

  describe('searchFriends', () => {
    it('should search friends', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=0&take=10')
        .expect(200)

      expect(response.body).to.have.lengthOf(2)
    })

    it('should search friends by userId', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=0&take=10&userId=bb')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friends by name', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=0&take=10&name=ano')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friends with skip', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=1&take=10')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should search friends with take', async () => {
      const user = getTestUser('asdf', 'Test')
      const user2 = getTestUser('aaaa', 'otherName')
      const user3 = getTestUser('bbb', 'anotherName')

      await getRepository(User).save(user)
      await getRepository(User).save(user2)
      await getRepository(User).save(user3)

      const friend = new UserFriend()
      friend.user = user
      friend.friend = user2

      const friend2 = new UserFriend()
      friend2.user = user3
      friend2.friend = user

      await getRepository(UserFriend).save(friend)
      await getRepository(UserFriend).save(friend2)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=0&take=1')
        .expect(200)

      expect(response.body).to.have.lengthOf(1)
    })

    it('should succeed to search friends if none exist', async () => {
      const user = getTestUser('asdf', 'Test')

      await getRepository(User).save(user)

      const response = await app
        .get('/api/users/asdf/friends/search?skip=0&take=10')
        .expect(200)

      expect(response.body).to.have.lengthOf(0)
    })

    it('should fail to search friends user not exist', async () => {
      await app.get('/api/users/asdf/friends/search?skip=0&take=10').expect(404)
    })
  })

  // describe('findFriendById', () => {})
  // describe('addFriend', () => {})
  // describe('removeFriend', () => {})
})

function getTestUser(id: string, name: string) {
  const user = new User()
  user.id = id
  user.name = name
  user.dateCreated = new Date()
  user.verification = new UserVerification()
  user.settings = new UserSettings()
  user.reputation = new UserReputation()
  user.profile = new UserProfile()
  user.level = new UserLevel()
  user.balance = new UserBalance()

  return user
}
