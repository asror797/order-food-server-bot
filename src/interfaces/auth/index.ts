import { Request } from 'express'
import { IRole, Module } from './../role'

export interface DataStoredToken {
  id: string
  role: IRole
  org: string
  modules: Module[]
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  data?: DataStoredToken
}
