import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested
} from 'class-validator'
import { Category } from '../interfaces/food.interface'
import { Type } from 'class-transformer'

class ProductWithAmount {
  @IsString()
  product: string

  @IsNumber()
  amount: number
}

export class CreateFood {
  @IsString()
  name: string

  @IsNumber()
  cost: number

  @IsString()
  org: string

  @IsEnum(Category)
  category: string

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
  category: string

  @IsString()
  org: string
}

export class UpdateFoodDto {
  @IsNotEmpty()
  @IsString()
  food: string

  @IsString()
  name?: string

  @IsNumber()
  cost?: number

  @IsString()
  org?: string

  @IsString()
  category?: string

  @IsString()
  img?: string

  @IsBoolean()
  is_deleted?: boolean
}
