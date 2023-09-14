import { IsNumber, IsString } from "class-validator";

export class CreateLunch {
  @IsString()
  name: string

  @IsNumber()
  cost: number

  @IsString()
  org: string
}