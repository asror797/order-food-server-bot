import { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions'

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'something went wrong'

    res.status(status).json({
      message: message,
      status: status
    })
  } catch (error) {
    next(error)
  }
}
