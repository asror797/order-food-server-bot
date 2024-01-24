import { Document } from 'mongoose'

export interface IAction extends Document {
  uri: string
  permission: boolean
}

export interface IModule extends Document {
  uri: string
  permission: boolean
  actions: IAction[]
}

export interface IRole extends Document {
  title: string
  modules: IModule[]
}


/* Soft interfaces  */
export interface Action {
  uri: string
  permission: boolean
}

export interface Module {
  uri: string
  permission: boolean
  actions: Action[]
}

export interface Role {
  title: string
  modules: Module[]
}

export interface RoleRetrieveAllRequest {
  pageSize: number
  pageNumber: number
}

export interface RoleList extends IRole {
  _id: string
}

export interface RoleRetrieveAllResponse {
  roles: RoleList[]
}

export interface RoleRetrieveRequest {
  id: string
}

export interface RoleRetrieveResponse {
  _id: string
  title: string
  modules: Module[]
}

export interface RoleCreateRequest {
  title: string
  modules: Module[]
}
