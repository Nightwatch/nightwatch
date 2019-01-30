import { createConnection } from 'typeorm'
const testSettings = require('../../../ormconfig.test.json')

export async function createTestDatabaseConnection() {
  await createConnection(testSettings)
}
