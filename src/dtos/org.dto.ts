import 'reflect-metadata'
import { OrgCreateRequest, OrgUpdateRequest } from '@interfaces'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'

export class OrgCreateDto implements OrgCreateRequest {
  @IsString()
  @IsNotEmpty()
  name_org: string

  @IsNumber()
  @IsNotEmpty()
  group_a_id: number

  @IsNumber()
  @IsNotEmpty()
  group_b_id: number

  @IsPositive()
  @IsNotEmpty()
  trip_timeout: number
}

export class OrgUpdateDto implements OrgUpdateRequest {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsOptional()
  @IsNumber()
  group_a_id?: number

  @IsOptional()
  @IsNumber()
  group_b_id?: number

  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  @IsOptional()
  @IsNumber()
  name_org?: string
}
