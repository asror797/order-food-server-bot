import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { ProductCreateRequest } from './../interfaces'

export class CreateProductBody {
  @IsString()
  name: string

  @IsString()
  unit: string
}

export class CreateProduct implements ProductCreateRequest {
  @IsString()
  name: string

  @IsString()
  unit: string

  @IsString()
  org: string
}

export class UpdateAmount {
  @IsString()
  product: string

  @IsNumber()
  amount: number

  @IsNumber()
  cost: number
}

export class UpdateAmountWithType {
  @IsString()
  product: string

  @IsNumber()
  amount: number

  @IsNumber()
  cost: number

  @IsBoolean()
  type: boolean
}
