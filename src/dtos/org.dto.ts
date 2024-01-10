import { IsNumber, IsString } from 'class-validator'

export class UpdateGroupDto {
  @IsNumber()
  group_a_id: number

  @IsNumber()
  group_b_id: number

  @IsString()
  org?: string
}

export class Update {
  @IsString()
  org: string

  @IsNumber()
  group_a_id?: number

  @IsNumber()
  group_b_id?: number

  @IsNumber()
  trip_timeout?: number
}
