import { IOrg } from "./org.interface";
import { IProduct } from "./product.interface";


export enum Category {
  DRINKS = 'drinks',
  SNAKCS = 'snacks',
  DESSERT = 'dessert',
}

export interface IFood extends Document {
  is_active: boolean;
  products: IProduct[];
  name: string;
  cost: number;
  org: IOrg['_id'];
  category: Category;
}