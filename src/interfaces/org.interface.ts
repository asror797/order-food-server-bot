import { Document } from "mongoose"

export interface IOrg extends Document {
  name_org: string
  group_a_id: number;
  group_b_id: number;
  is_active: boolean
  is_verified: boolean
  is_deleted: boolean;
}