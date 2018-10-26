import { createConnection } from 'typeorm'

export async function createTestDatabaseConnection () {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'nightwatch',

    synchronize: true,
    logging: false,
    entities: [ 'node_modules/@nightwatch/db/dist/entity/**/*.js' ],
    migrations: [ 'src/migrations/**/*.ts' ],
    subscribers: [ 'src/subscribers/**/*.ts' ],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscribers'
    }
  })
}
