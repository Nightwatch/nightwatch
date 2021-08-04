import { createConnection } from 'typeorm'
import * as express from 'express'
import * as path from 'path'
import { init } from './utilities'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import { container } from './ioc/inversify.config'
import * as cors from 'cors'
import * as compression from 'compression'
import * as errorHandler from 'errorhandler'
import * as jwt from 'express-jwt'
import * as jsonwebtoken from 'jsonwebtoken'
import * as RateLimit from 'express-rate-limit'
import * as socketIo from 'socket.io'
import { Config } from '../../common'

let secret = ''

try {
  const config: Config = require('../../../config/config.json')
  secret = config.api.secret
} catch (err) {
  console.error(err)
}

/**
 * The API server
 */
export class Api {
  /**
   * Starts the API server.
   */
  public static start(): Api {
    return new Api()
  }
  /**
   * Creates an instance of the Api.
   */
  constructor() {
    this.init().catch(err => {
      console.error(err)
    })
  }

  private async init() {
    await createConnection()
    this.startServer()
  }

  private startServer() {
    const server = new InversifyExpressServer(container)

    const limiter = RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 150,
      skip: (request: express.Request, _: any) => {
        console.log(request.connection.localAddress)
        console.log(request.connection.remoteAddress)
        if (request.ip === '::1' || request.ip === '::ffff:127.0.0.1' || request.ip.startsWith('::ffff:172')) {
          return true
        }

        return false
      }
    })

    server.setConfig(app => {
      app.enable('trust proxy')
      app.use(limiter)
      app.use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      app.use(bodyParser.json())
      app.use(helmet())
      app.use(cors())
      app.use(compression())
      app.use(
        morgan('tiny', {
          stream: {
            write: message => console.info(message.trim())
          }
        })
      )

      app.use(
        jwt({
          secret,
          getToken: req => {
            // Special routes I don't want the average user to see :)
            // TODO: Create route-based authentication, decorators would be nice.
            const blacklistedRoutes: ReadonlyArray<any> = ['keys']

            if (
              req.method.toLowerCase() === 'get' &&
              !blacklistedRoutes.some(route =>
                req.path.toLowerCase().includes(route)
              )
            ) {
              // *Hacky* approach to bypass request validation for GET requests
              // Allows anyone to make a GET request
              return jsonwebtoken.sign('GET', secret)
            }

            if (
              req.headers.authorization &&
              req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer'
            ) {
              return req.headers.authorization.split(' ')[1]
            } else if (req.query && req.query.token) {
              return req.query.token
            }
            return null
          }
        })
      )

      app.use('/api', express.static(path.join(__dirname, '../../../public')))

      app.use(
        (
          err: any,
          _: express.Request,
          res: express.Response,
          __: express.NextFunction
        ) => {
          console.error(err)
          res.status(500).send('Oof! Something went wrong.')
        }
      )

      app.use(errorHandler())
    })

    const api = server.build()
    const port = process.env.PORT || 4000
    const instance = api.listen(port)

    const io = socketIo.listen(instance)
    init(io)

    console.info(`Express server listening on port ${port}`)
  }
}
