import { IsString } from "class-validator";



export class AdminLoginDto {
  @IsString()
  phone_number: string;

  @IsString()
  password: string;
}