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
  module: IModule[]
}


/*  */
export interface IAction {
  uri: string
  permission: boolean
}

export interface IModule {
  uri: string
  permission: boolean
  actions: IAction[]
}

export interface IRole {
  title: string
  module: IModule[]
}

export interface RoleRetrieveAllRequest {
  pageSize: number
  pageNumber: number
}

export interface RoleRetrieveAllResponse {

}