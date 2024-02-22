import { AdminCreateRequest, AdminUpdateRequest } from '@interfaces'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

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

export class AdminUpdateDto implements AdminUpdateRequest {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  fullname?: string

  @IsString()
  @IsOptional()
  org?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  phone_number?: string

  @IsString()
  @IsOptional()
  role?: string
}
