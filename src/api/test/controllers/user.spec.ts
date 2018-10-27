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
  UserBalance
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
      .expect(400)

    expect(response.body)
      .to.haveOwnProperty('id')
      .which.equals('asdf')
    expect(response2.body).to.not.exist
  })

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
