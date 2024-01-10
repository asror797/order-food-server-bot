import { NextFunction, Request, Response } from 'express'
import { httException } from '../exceptions/httpException'

const errorMiddleware = (
  error: httException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'something went wrong'

    res.status(status).json({
      message: message,
      status: status,
    })
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
