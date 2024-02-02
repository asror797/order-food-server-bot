import { NextFunction, Request, Response } from 'express'
import { PaymentService } from '@services'
import { ParsedQs } from 'qs'

class PaymentController {
  public paymentService = new PaymentService()

  public paymentRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.paymentService.getRetrieveAll({ page, size }))
    } catch (error) {
      next(error)
    }
  }
}

export default PaymentController
