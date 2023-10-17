import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLunch {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  cost: number

  @IsString()
  @IsNotEmpty()
  org: string

  @IsString()
  @IsNotEmpty()
  base: string
}


export class LunchUpdateDto {
  @IsString()
  @IsNotEmpty()
  id:string
  
  @IsString()
  @IsOptional()
  name?:string

  @IsNumber()
  @IsOptional()
  cost?: number

  @IsString()
  @IsOptional()
  base?:string

  @IsString()
  @IsOptional()
  org?:string

  @IsNumber()
  @IsOptional()
  percent_cook?: number
}