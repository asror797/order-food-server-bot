import { Document } from "mongoose";
import { IOrg } from "./org.interface";




export interface ILunch extends Document {
  org: IOrg['_id']
  name: string
  cost: number
}