import { NextFunction, Request, Response } from 'express'
import { PaymentService } from '@services'
import { ParsedQs } from 'qs'
import { HttpException } from '@exceptions'

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

  public calculateSpents = async(req:Request<ParsedQs>,res:Response,next:NextFunction) => {
    try {
      const user = req.query.user as string | undefined
      const start = req.query.start  as string | undefined
      const end = req.query.end as string | undefined
      const org = req.query.org as string | undefined

      if(!user) {
        throw new HttpException(400,'userId is required')
      }

      res.json(await this.paymentService.calculateSpents({
        user,
        org,
        start,
        end
      }))
    } catch (error) {
      next(error)
    }
  }
}

export default PaymentController
