/* tslint:disable:no-unused-expression */

import 'reflect-metadata'
import 'mocha'
import { expect } from 'chai'
import { createTestDatabaseConnection } from '..'
import { container } from '../../src/ioc/inversify.config'
import * as supertest from 'supertest'
import { getRepository, getConnection } from 'typeorm'
import {
  InversifyExpressServer,
  cleanUpMetadata
} from 'inversify-express-utils'
import * as bodyParser from 'body-parser'
import { Guild, GuildSettings } from '../../../db'

describe('GuildController', () => {
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

  after(async () => {
    const connection = getConnection()
    await connection.dropDatabase()
    connection.close().catch(() => {
      // swallow
    })
  })

  describe('find', () => {
    it('should get all guilds when no guilds exist', async () => {
      const response = await app.get('/api/guilds').expect(200)
      expect(response.body).to.not.be.null
      expect(response.body).to.have.lengthOf(0)
    })

    it('should get all guilds', async () => {
      const guild = getTestGuild('aaa', 'Test1')
      const guild2 = getTestGuild('bbb', 'Test2')
      const guild3 = getTestGuild('ccc', 'Test3')

      await getRepository(Guild).save(guild)
      await getRepository(Guild).save(guild2)
      await getRepository(Guild).save(guild3)

      const response = await app.get('/api/guilds').expect(200)

      expect(response.body).to.not.be.null
      expect(response.body).to.have.lengthOf(3)
    })
  })

  describe('findById', () => {
    it('should get a guild by id', async () => {
      const guild = getTestGuild('asdf', 'Test')

      await getRepository(Guild).save(guild)

      const response = await app.get('/api/guilds/asdf').expect(200)

      expect(response.body)
        .to.haveOwnProperty('id')
        .which.equals('asdf')
    })

    it('should return undefined on get by id for non existant id', async () => {
      const response = await app.get('/api/guilds/asdf').expect(404)

      expect(response.body).to.be.empty
    })
  })
})

function getTestGuild(id: string, name: string) {
  const guild = new Guild()
  guild.id = id
  guild.name = name
  guild.dateCreated = new Date()
  guild.settings = new GuildSettings()

  return guild
}
