import { Response } from 'express'
import { controller, httpGet, queryParam, response } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Types } from '../constants'
import { AuthenticationService } from '../services/authentication'

/**
 * Authentication controller for authenticating users in the web interface through Discord.
 *
 * /api/auth
 * @class AuthenticationController
 */
@controller('/api/auth')
export class AuthenticationController {
  constructor (@inject(Types.AuthenticationService) private authenticationService: AuthenticationService) {}

  /**
   * Gets an access token from Discord.
   * @param code The code used to get the access token.
   * @param redirect Where to redirect after getting the access token.
   */
  @httpGet('/token/discord')
  async getToken (
    @queryParam('code') code: string,
    @queryParam('redirect') redirect: string,
    @response() res: Response
  ) {
    return this.authenticationService.getDiscordAccessToken(code, redirect).catch(() => {
      res.sendStatus(400)
    })
  }
}
