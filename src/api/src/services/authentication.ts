import axios from 'axios'
import { injectable } from 'inversify'

let clientSecret: string = ''
let clientId: string = ''

try {
  clientSecret = require('../../../../config/api.json').bot.clientSecret
  clientId = require('../../../../config/api.json').bot.clientId
} catch (err) {
  // swallow
}

/**
 * Authentication service to handle authentication through Discord and web interface.
 *
 * @class AuthenticationService
 */
@injectable()
export class AuthenticationService {
  public async getDiscordAccessToken (code: string, redirect: string) {
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const response = await axios.post(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      null,
      { headers: { Authorization: `Basic ${creds}` } }
    )

    return response.data
  }
}
