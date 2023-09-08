import { IOrg } from "./org.interface";
import { IProduct } from "./product.interface";


export interface IFood extends Document {
  is_active: boolean;
  products: IProduct[];
  name: string;
  cost: number;
  org: IOrg['_id'];
  category: number;
}