import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  public first_name: string

  @IsString()
  public last_name: string

  @IsString()
  public telegram_id: number

  @IsString()
  public phone_number: string
}

export class ChangeStatus {
  @IsString()
  user: string

  @IsString()
  type: string
}

export class UpdateUserDto {
  @IsString()
  _id: string

  @IsString()
  org: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsBoolean()
  is_active?: boolean

  @IsBoolean()
  is_verified?: boolean

  @IsString()
  type: string
}

export class VerifyUser {
  @IsString()
  _id: string
}

export class SendMessae {
  @IsString()
  org: string

  @IsString()
  message: string
}

export class ChangeOrg {
  @IsString()
  user: string

  @IsString()
  org: string
}

export class Payment {
  @IsString()
  type: string

  @IsNumber()
  amount: number
}

export class EditRole {
  @IsString()
  user: string

  @IsString()
  role: string
}

export class SearchPaginationDto {
  @IsString()
  search: string

  @IsNumber()
  @IsPositive()
  page: number

  @IsNumber()
  @IsPositive()
  size: number
}

export class EditUserDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @IsString()
  @IsOptional()
  first_name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsMongoId()
  @IsOptional()
  org: string

  @IsOptional()
  @IsString()
  role?: string
}
