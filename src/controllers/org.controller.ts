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
      const orgId = req.params.id as string
      res.json(await this.orgService.orgRetrieveOne({ id: orgId }))
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
      res.json(await this.orgService.orgCreate(req.body))
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
      const orgId = req.params.id as string
      const orgData = req.body
      res.json(await this.orgService.orgUpdate({ ...orgData, id: orgId }))
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
      const orgId = req.params.id
      res.json(await this.orgService.orgDelete({ id: orgId }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
