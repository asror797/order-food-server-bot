import { HttpException } from '@exceptions'
import { RoleService } from '@services'
import { NextFunction, Request, Response } from 'express'

export class RoleController {
  public roleService = new RoleService()

  public roleRetrieveAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.roleService.roleRetrieveAll({
          pageNumber: 1,
          pageSize: 10
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newRole = await this.roleService.roleCreate({
        modules: [],
        title: req.body.title
      })
      res.json(newRole)
    } catch (error) {
      next(error)
    }
  }

  public updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const title = req.body.title
      const roleId = req.params.id

      if (!title || !roleId) {
        throw new HttpException(400, 'roleId or title not found')
      }
      res.json(
        await this.roleService.roleUpdate({
          title,
          id: roleId
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id
      if (!id) throw new HttpException(400, 'Role Not Found')
      res.json(await this.roleService.deleteRole({ id }))
    } catch (error) {
      next(error)
    }
  }

  public addModule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.module_uri)
        throw new HttpException(400, 'module_uri is empty')
      res.json(await this.roleService.addModuleToRole(req.body))
    } catch (error) {
      next(error)
    }
  }

  public updateModule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { module_uri, new_uri } = req.body
      if (!module_uri || !new_uri)
        throw new HttpException(400, 'module_uri or new_uri is empty')
      res.json(await this.roleService.updateModule({ module_uri, new_uri }))
    } catch (error) {
      next(error)
    }
  }

  public deleteModule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { module_uri } = req.body
      res.json(await this.roleService.deleteModule({ module_uri }))
    } catch (error) {
      next(error)
    }
  }

  public toggleModule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { module_id, role_id } = req.body
      if (!module_id || !role_id)
        throw new HttpException(400, 'module or role not found')
      res.json(
        await this.roleService.toggleModule({
          module_id: module_id,
          role_id: role_id
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public addAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(
        await this.roleService.addActionToModule({
          action_uri: req.body.action_uri,
          module_uri: req.body.module_uri
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public updateAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { module_uri, new_uri, action_uri } = req.body
      if (!module_uri || !new_uri || !action_uri) {
        throw new HttpException(
          400,
          'module_uri or action_uri or new_uri is empty'
        )
      }
      res.json(
        await this.roleService.updateAction({
          module_uri,
          action_uri,
          new_uri
        })
      )
    } catch (error) {
      next(error)
    }
  }

  public deleteAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { module_uri, action_uri } = req.body
      if (!module_uri || !action_uri) {
        throw new HttpException(400, 'action_uri and module_uri is required')
      }
      res.json(await this.roleService.deleteModule({ action_uri, module_uri }))
    } catch (error) {
      next(error)
    }
  }

  public toggleAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role_id, module_id, action_id } = req.body
      if (!role_id || !module_id || !action_id) {
        new HttpException(400, 'role_id or module_id or action_id is required')
      }
      res.json(
        await this.roleService.toggleAction({ role_id, module_id, action_id })
      )
    } catch (error) {
      next(error)
    }
  }
}
