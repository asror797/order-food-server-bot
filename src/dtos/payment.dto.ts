import { IsNumber, IsString } from "class-validator";



export class CreatePaymentDto {
  @IsString()
  user: string;

  @IsNumber()
  amount: number;
}