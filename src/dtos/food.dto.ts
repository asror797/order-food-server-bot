import { IsArray, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { Category } from "../interfaces/food.interface";
import { Type } from "class-transformer";




class ProductWithAmount {
  @IsString()
  product: string;

  @IsNumber()
  amount: number;
}

export class CreateFood {
  @IsString()
  name: string

  @IsNumber()
  cost: number

  @IsString()
  org: string;

  @IsEnum(Category)
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductWithAmount)
  products: ProductWithAmount[]
}


export class GetFoods {
  @IsNumber()
  page?: number 

  @IsNumber()
  size?: number

  @IsString()
  category: string;

  @IsString()
  org: string;
}