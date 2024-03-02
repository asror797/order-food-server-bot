import { NextFunction, Request, Response } from 'express'
import { PaymentService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

export class PaymentController {
  public paymentService = new PaymentService()

  public paymentRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json({ page, size })
    } catch (error) {
      next(error)
    }
  }

  public paymentRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      next(error)
    }
  }

  public paymentCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      next(error)
    }
  }

  public paymentUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      next(error)
    }
  }

  public paymentDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      next(error)
    }
  }

  public calculateSpents = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.query.user as string | undefined

      if (!user) {
        throw new HttpException(400, 'userId is required')
      }

      res.json({})
    } catch (error) {
      next(error)
    }
  }
}
