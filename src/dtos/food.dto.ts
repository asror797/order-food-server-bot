import 'reflect-metadata'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator'
import {
  CategoryEnum,
  FoodCreateRequest,
  FoodProductsDefinition
} from '@interfaces'

class ProductWithAmount {
  @IsString()
  product: string

  @IsNumber()
  amount: number
}

export class FoodCreateDto implements FoodCreateRequest {
  @IsString()
  @IsNotEmpty()
  category: string

  @IsPositive()
  @IsNotEmpty()
  cost: number

  @IsString()
  @IsUrl()
  @IsOptional()
  img?: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  org: string
  products: FoodProductsDefinition[]
}

export class CreateFood {
  @IsString()
  name: string

  @IsNumber()
  cost: number

  @IsString()
  org: string

  @IsEnum(CategoryEnum)
  category: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductWithAmount)
  products: ProductWithAmount[]
}
