import { NextFunction, Response } from 'express'
import { RequestWithUser } from '@interfaces'
import { HttpException } from '@exceptions'
import { verify } from 'jsonwebtoken'

// get token and set user info to req
const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = req.url
    if (url == '/docs' || url == '/auth/login') {
      return next()
    }
    const Authorization =
      req.header('Authorization')?.split('Bearer ')[1] || null
    if (!Authorization) throw new HttpException(401, 'unauthorized')

    if (Authorization) {
      const verificationResponse = verify(Authorization, 'secret_key') as any

      if (verificationResponse) {
        req.data = verificationResponse
        next()
      } else {
        next(new HttpException(401, 'Wrong authenticaton token'))
      }
    }
  } catch (error) {
    next(error)
  }
}

export default authMiddleware
