import { AdminCreateRequest } from '@interfaces'
import { IsNotEmpty, IsString } from 'class-validator'

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

export class AdminCreateDto implements AdminCreateRequest {
  @IsString()
  @IsNotEmpty()
  phone_number: string

  @IsString()
  @IsNotEmpty()
  fullname: string

  @IsString()
  @IsNotEmpty()
  org: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  role: string
}
