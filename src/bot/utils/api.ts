import * as jwt from 'jsonwebtoken'
import axios from 'axios'
import { Config } from '../../common/models/interfaces/config'

const config: Config = require('../../../config/config.json')

const apiToken = jwt.sign({}, config.api.secret)

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:4000/api',
  headers: {
    Authorization: `Bearer ${apiToken}`
  }
})
