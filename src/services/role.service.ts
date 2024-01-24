import { 
  RoleCreateRequest,
  RoleRetrieveAllRequest,
  RoleRetrieveAllResponse, 
  RoleRetrieveRequest, 
  RoleRetrieveResponse 
} from './../interfaces'
import { roleModel } from '@models'
import { HttpException } from '@exceptions'
import { AddAction, AddModuleDto } from './../dtos/role.dto'
import { Types } from 'mongoose'

export class RoleService {
  public role = roleModel

  public async roleRetrieveAll(payload: RoleRetrieveAllRequest):Promise<RoleRetrieveAllResponse> {

    const skip = (payload.pageNumber - 1) * payload.pageSize

    const roles = await this.role.find().skip(skip).select('title modules')

    return {
      roles: roles
    }
  }

  public async roleRetrieve(payload: RoleRetrieveRequest):Promise<RoleRetrieveResponse> {

    const role = await this.role.findById(payload.id).select('*')
    if(!role) throw new HttpException(404,'Not Found role')
    return {
      _id: role.id,
      title: role.title,
      modules: role.modules
    }
  }

  public async roleCreate(payload:RoleCreateRequest):Promise<any> {
    const roleCopy = (await this.role.findOne().exec()) as any

    if(roleCopy) {
      
      roleCopy.modules = roleCopy.modules.map((md:any) => {

        const actions = md.actions.map((ac:any) => {
          return {
            permission: false,
            uri: ac.uri
          }
        })
        return {
          uri: md.uri,
          permission: false,
          actions
        }
      })
      delete roleCopy._id
      roleCopy.title = payload.title
    }

    if(roleCopy) {
      const newRole = await this.role.create({
        title: payload.title,
        modules: roleCopy.modules
      })

      return newRole
    } else {
      const NewRole = await this.role.create(payload)
      return NewRole
    }
  }

  public async roleUpdate(payload: any):Promise<any> {
    const updatedRole = await this.role
            .findByIdAndUpdate(payload.id, {
              $set: {
                title: payload.title
              },
            })
            .exec()
  return updatedRole
  }

  public async deleteRole(payload:any):Promise<any> {
    const deletedRole = await this.role.findByIdAndDelete(payload.id).exec()
    return deletedRole
  }

  public async roleModuleDelete(payload:any):Promise<any> {
    const updatedRole = await this.role.findByIdAndDelete(payload.id).exec()
    return updatedRole
  }

  public async addModuleToRole(payload:AddModuleDto) {
    const addedModule = await this.role.updateMany(
      {},
      {
        $push: {
          modules: { uri: payload.module_uri }
        }
      }
    ).exec()

    return addedModule
  }

  public async updateModule(payload:{ module_uri: string, new_uri: string }) {
    const updatedModule = await this.role
        .updateMany(
          {
            'modules.uri': payload.module_uri,
          },
          {
            $set: {
              'modules.$.uri': payload.new_uri,
            },
          },
        ).exec()

    return updatedModule
  }

  public async deleteModule(payload:any):Promise<any> {
    const deleteModule = await this.role.updateMany(
      {},
      {
        $pull: {
          uri: payload.module_uri
        }
      }
    ).exec()

    return deleteModule
  }

  public async toggleModule(payload:{role_id: string,module_id: string}) {

    const permission = await this.role.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(payload.role_id)
        },
      },
      {
        $unwind: {
          path: '$modules'
        }
      },
      {
        $match: {
          'modules._id': new Types.ObjectId(payload.module_id)
        }
      },
      {
        $project: {
          permission: '$modules.permission'
        }
      }
    ]).exec()

    const toggleModuleResult = await this.role.updateOne(
      {
        'modules._id': new Types.ObjectId(payload.module_id),
        _id: new Types.ObjectId(payload.role_id)
      },
      {
        $set: {
          'modules.$.permission': permission.length > 0 ? !permission[0].permission : false,
        }
      }
    )

    return toggleModuleResult
  }

  public async addActionToModule(payload:AddAction):Promise<any> {
    const createdAction = await this.role.updateMany(
      {
        'modules.uri': payload.module_uri
      },
      {
        $push: {
          'modules.$.actions': {
            uri: payload.action_uri
          }
        }
      }
    )
    .exec()

    return createdAction
  }


  public async deleteAction(payload:any):Promise<any> {


    return 
  }
}
