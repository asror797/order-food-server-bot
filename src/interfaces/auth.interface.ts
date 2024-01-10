import { Request } from 'express'

export interface DataStoredToken {
  _id: string
  role: string[]
  org: string
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  user?: DataStoredToken
}
