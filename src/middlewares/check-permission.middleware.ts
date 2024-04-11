import { Response, NextFunction } from 'express'
import { RequestWithUser } from '@interfaces'
import { HttpException } from '@exceptions'

export const checkPermission = (requiredPermission: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    // if (!req.data) {
    //   throw new HttpException(400, 'unauthorized')
    // }
    console.log(requiredPermission)
    // find action and next
    next()
  }
}
