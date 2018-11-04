import * as jwt from 'jsonwebtoken'
import { Api } from '../../api/src/api'
import axios from 'axios'
import { Config } from '../../common/models/interfaces/config'

const config: Config = require('../../../config/config.json')

let apiToken = jwt.sign({}, Api.secret, {})

export const api = axios.create({
  baseURL: config.api.address,
  headers: {
    Authorization: `bearer ${apiToken}`
  }
})
