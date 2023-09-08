import { Document } from "mongoose"

export interface IOrg extends Document {
  name_org: string
  is_active: boolean
  is_verified: boolean
  is_deleted: boolean
}