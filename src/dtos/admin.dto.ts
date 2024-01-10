import { IsString } from 'class-validator'

export class AdminLoginDto {
  @IsString()
  phone_number: string

  @IsString()
  password: string
}

export class CreateAdmin {
  @IsString()
  phone_number: string

  @IsString()
  fullname: string

  @IsString()
  password: string

  @IsString()
  org: string

  @IsString()
  role: string
}
