import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class CreateProductLog {
  @IsString()
  product: string

  @IsNumber()
  amount: number

  @IsBoolean()
  type: boolean

  @IsString()
  org: string

  @IsNumber()
  cost: number
}
