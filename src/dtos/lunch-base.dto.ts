import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetLunchBaseDto {
  @IsInt()
  @IsOptional()
  page: number

  @IsInt()
  @IsOptional()
  size: number

  @IsString()
  @IsOptional()
  search?: string

}


export class CreateLunchBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  org: string
}


export class UpdateLunchBaseDto {

  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  org?: string
}