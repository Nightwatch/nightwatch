import axios from 'axios'
import { injectable } from 'inversify'
import { Config } from '../../../common'

let clientSecret = ''
let clientId = ''

try {
  const config: Config = require('../../../../config/config.json')
  const { clientSecret: localclientSecret, clientId: localclientId } = config.bot
  clientSecret = localclientSecret
  clientId = localclientId
} catch (err) {
  console.error(err)
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
