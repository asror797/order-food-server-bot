import { Document } from "mongoose";
import { IOrg } from "./org.interface";



export enum Units {
  KILOGRAM = 'kilogram',
  LITR = 'litr',
  SHIT = 'shit'
}

export interface IProduct extends Document {
  name: string;
  amount: number;
  org: IOrg['_id'];
  unit: String
}