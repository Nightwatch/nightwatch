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
import { randomBytes } from 'crypto'

const secret = randomBytes(64).toString('hex')
let ormConfig: any

try {
  ormConfig = require('../../../config/ormconfig.json')
} catch (err) {
  console.error(err)
}

/**
 * The API server
 *
 * @class Api
 */
export class Api {
  /**
   * Creates an instance of the Api.
   * @memberof Api
   */
  constructor () {
    this.init().catch(err => {
      console.error(err)
    })
  }

  /**
   * API secret for creating and validating JWT tokens.
   */
  public static readonly secret = secret

  /**
   * Starts the API server.
   *
   * @static
   * @returns {Api}
   * @memberof Api
   */
  static start (): Api {
    return new Api()
  }

  private async init () {
    await createConnection(ormConfig)
    this.startServer()
  }

  private startServer () {
    const server = new InversifyExpressServer(container)

    const limiter = new RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 150,
      delayMs: 0,
      skip: (request: express.Request, _) => {
        if (
          request.ip === '::1' ||
          request.ip === '::ffff:127.0.0.1'
        ) {
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
          secret: Api.secret,
          getToken: req => {
            // Special routes I don't want the average user to see :)
            // TODO: Create route-based authentication, decorators would be nice.
            const blacklistedRoutes = ['keys']

            if (
              req.method.toLowerCase() === 'get' &&
              !blacklistedRoutes.some(route =>
                req.path.toLowerCase().includes(route)
              )
            ) {
              // *Hacky* approach to bypass request validation for GET requests, since I want anyone to be able to see the data.
              return jsonwebtoken.sign('GET', Api.secret)
            }

            if (
              req.headers.authorization &&
              req.headers.authorization.split(' ')[0] === 'Bearer'
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

    const app = server.build()
    const port = process.env.PORT || 4000
    const instance = app.listen(port)

    const io = socketIo.listen(instance)
    init(io)

    console.info(`Express server listening on port ${port}`)
  }
}
