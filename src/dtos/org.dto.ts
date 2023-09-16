import { IsNumber, IsString } from "class-validator";



export class UpdateGroupDto {
  @IsNumber()
  group_a_id: number;

  @IsNumber()
  group_b_id: number;

  @IsString()
  org?: string;
}