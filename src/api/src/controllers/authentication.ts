import { Response } from 'express'
import {
  controller,
  httpGet,
  queryParam,
  response
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types } from '../../../common'
import { AuthenticationService } from '../services/authentication'

/**
 * Authentication controller for authenticating users in the web interface through Discord.
 *
 * /api/auth
 * @class AuthenticationController
 */
@controller('/api/auth')
export class AuthenticationController {
  @inject(Types.AuthenticationService)
  private readonly authenticationService: AuthenticationService

  /**
   * Gets an access token from Discord.
   * @param code The code used to get the access token.
   * @param redirect Where to redirect after getting the access token.
   */
  @httpGet('/token/discord')
  public async getToken(
    @queryParam('code') code: string,
    @queryParam('redirect') redirect: string,
    @response() res: Response
  ) {
    return this.authenticationService
      .getDiscordAccessToken(code, redirect)
      .catch(() => {
        res.sendStatus(400)
      })
  }
}
