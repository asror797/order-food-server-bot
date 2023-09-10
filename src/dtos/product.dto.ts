import { IsString } from "class-validator";




export class CreateProduct {
  @IsString()
  name: string;

  @IsString()
  unit: string;
}