import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";



class FoodWithAmount {
  @IsString()
  food: string;

  @IsNumber()
  amount: number
}


export class CreateOrderDto {

  @IsString()
  client: string;

  @IsString()
  org: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodWithAmount)
  foods: FoodWithAmount[]
}