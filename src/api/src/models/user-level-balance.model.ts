import { UserBalance, UserLevel } from '../../../db'

export interface UserLevelBalance {
  readonly level: UserLevel
  readonly balance?: UserBalance
}
