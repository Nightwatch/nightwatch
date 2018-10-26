import { UserBalance, UserLevel } from '../../../db'

export interface UserLevelBalance {
  level: UserLevel
  balance?: UserBalance
}
