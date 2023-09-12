import { IsString } from "class-validator";



export class CreateProductBody {
  @IsString()
  name: string;

  @IsString()
  unit: string;
}



export class CreateProduct {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsString()
  org: string;
}