import { NextFunction, Request, Response } from 'express'
import { PaymentService } from '@services'
import { ParsedQs } from 'qs'

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
      res.json(await this.paymentService.paymentCreate({ ...req.body }))
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
      res.json(await this.paymentService.paymentUpdate())
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
      res.json(await this.paymentService.paymentDelete())
    } catch (error) {
      next(error)
    }
  }
}
