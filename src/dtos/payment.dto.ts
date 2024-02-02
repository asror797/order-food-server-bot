import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  user: string

  @IsNumber()
  amount: number

  @IsString()
  @IsOptional()
  org?: string
}
