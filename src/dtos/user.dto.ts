import { IsString } from "class-validator"

export class CreateUserDto {

  @IsString()
  public first_name: string

  @IsString()
  public last_name: string;

  @IsString()
  public telegram_id: number;

  @IsString()
  public phone_number: string;
}

export class ChangeStatus {
  @IsString()
  user: string;

  @IsString()
  type: string;
}