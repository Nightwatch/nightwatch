import axios from 'axios'
import { injectable } from 'inversify'
import { Config } from '../../../common'
import { AuthenticationService as IAuthenticationService } from '../interfaces'

let clientSecret = ''
let clientId = ''

try {
  const config: Config = require('../../../../config/config.json')
  const {
    clientSecret: localclientSecret,
    clientId: localClientId
  } = config.bot
  clientSecret = localclientSecret
  clientId = localClientId
} catch (err) {
  console.error(err)
}

/**
 * Authentication service to handle authentication through Discord and web interface.
 *
 */
@injectable()
export class AuthenticationService implements IAuthenticationService {
  public async getDiscordAccessToken(code: string, redirect: string) {
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const response = await axios.post(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      null,
      { headers: { Authorization: `Basic ${creds}` } }
    )

    return response.data
  }
}
