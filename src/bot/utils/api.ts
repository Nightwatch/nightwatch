import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import { Config } from '../../common/models/interfaces/config'

const config: Config = require('../../../config/config.json')

let apiToken = jwt.sign({}, config.api.secret)

export const api = axios.create({
  baseURL: config.api.address,
  headers: {
    Authorization: `Bearer ${apiToken}`
  }
})
