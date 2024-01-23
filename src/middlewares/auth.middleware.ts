import { NextFunction, Response } from 'express'
import { RequestWithUser } from '../interfaces/auth.interface'
import { HttpException } from '@exceptions'
import { verify } from 'jsonwebtoken'

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization =
      req.header('Authorization')?.split('Bearer ')[1] || null

    if (!Authorization) throw new HttpException(401, 'unauthorized')
    const url = req.url

    if (url == '/docs' || url == '/auth/login') {
      return next()
    } else {
      if (Authorization) {
        const verificationResponse = verify(Authorization, 'secret_key') as any

        if (verificationResponse) {
          req.user = verificationResponse
          next()
        } else {
          next(new HttpException(401, 'Wrong authenticaton token'))
        }
      }
    }
  } catch (error) {
    next(error)
  }
}

export default authMiddleware
