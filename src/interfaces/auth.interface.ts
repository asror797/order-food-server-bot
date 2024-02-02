import { Request } from 'express'
import { IRole } from './role.interface'

export interface DataStoredToken {
  _id: string
  role: IRole
  org: string
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  user?: DataStoredToken
}
