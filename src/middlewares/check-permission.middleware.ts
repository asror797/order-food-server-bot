import { Response, NextFunction } from 'express'
// import { HttpException } from '@exceptions'
import { RequestWithUser } from '@interfaces'

export const checkPermission = (requiredPermission: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(req.user)
    console.log(requiredPermission)

    next()
  }
}
