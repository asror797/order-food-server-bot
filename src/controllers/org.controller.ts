import { NextFunction, Request, Response } from 'express'
import { OrgService } from '@services'
import { ParsedQs } from 'qs'

export class OrgController {
  public orgService = new OrgService()

  public orgRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const search = req.query.search as string | undefined
      res.json(
        await this.orgService.orgRetrieveAll({
          pageNumber,
          pageSize,
          search
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public orgRetrieveOne = async (
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

  public orgCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orgData = req.body
      res.json(await this.orgService.orgCreate(orgData))
    } catch (error) {
      next(error)
    }
  }

  public orgUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public orgDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json('')
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
