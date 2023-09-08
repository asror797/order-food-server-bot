import { Document } from "mongoose";
import { IOrg } from "./org.interface";


export interface IProduct extends Document {
  name: string;
  amount: number;
  org: IOrg['_id'];
}