import { NextFunction, Request, Response } from 'express'
import { AdminService } from '@services'
import { ParsedQs } from 'qs'
// import { HttpException } from '@exceptions'

export class AdminController {
  public adminService = new AdminService()

  public adminRetrieveAll = async (
    req: Request<ParsedQs>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const pageNumber = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.size as string) || 10
      const search = req.query.search as string

      res.json(
        await this.adminService.adminRetrieveAll({
          pageNumber: pageNumber,
          pageSize: pageSize,
          search: search
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public adminRetrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string

      res.json(await this.adminService.adminRetrieveOne({ id }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public adminCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(await this.adminService.adminCreate(req.body))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public adminUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string
      const adminData = req.body

      res.json(
        await this.adminService.adminUpdate({
          id,
          ...adminData
        })
      )
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public adminDelete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string

      res.json(await this.adminService.adminDelete({ id }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
