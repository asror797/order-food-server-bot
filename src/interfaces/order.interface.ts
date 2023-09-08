import { Document } from "mongoose";
import { IFood } from "./food.interface";
import { IOrg } from "./org.interface";


export interface IOrder extends Document {
  foods: IFood[];
  client: string;
  is_canceled: boolean;
  is_accepted: boolean;
  org: IOrg['_id'];
}