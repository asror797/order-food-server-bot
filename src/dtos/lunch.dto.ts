import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateLunch {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  cost: number

  @IsString()
  @IsNotEmpty()
  org: string

  @IsString()
  @IsNotEmpty()
  base: string

  @IsOptional()
  products?: []
}


export class LunchUpdateDto {
  @IsString()
  @IsNotEmpty()
  id:string
  
  @IsString()
  @IsOptional()
  name?:string

  @IsNumber()
  @IsOptional()
  cost?: number

  @IsString()
  @IsOptional()
  base?:string

  @IsString()
  @IsOptional()
  org?:string

  @IsNumber()
  @IsOptional()
  percent_cook?: number
}


export class ProductWithAmountDto {
  @IsString()
  @IsNotEmpty()
  product: string

  @IsNumber()
  @IsNotEmpty()
  amount: number
}

export class PushProductDto {
  @IsString()
  @IsNotEmpty()
  lunch: string

  @ValidateNested({ each: true })
  products: ProductWithAmountDto[]
}