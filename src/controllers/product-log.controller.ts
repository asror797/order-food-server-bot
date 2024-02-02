import { NextFunction, Request, Response } from 'express'
import ProductLogService from '../services/product-log.service'
import { ParsedQs } from 'qs'

class ProductLogController {
  public logs = new ProductLogService()

  public getLogs = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10
      res.json(await this.logs.getLog(page, size))
    } catch (error) {
      next(error)
    }
  }
}

export default ProductLogController
