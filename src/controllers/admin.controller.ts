import { NextFunction, Request, Response } from 'express'
import { AdminService } from '@services'
// import { HttpException } from '@exceptions'

export class AdminController {
  public adminService = new AdminService()

  public adminRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      res.json(
        await this.adminService.adminRetrieveAll({
          pageNumber: 1,
          pageSize: 1,
          search: ''
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
      res.json(req.body)
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
      res.json(req.body)
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
      res.json(req.body)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
