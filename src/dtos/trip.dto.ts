import { IsNumber, IsString } from 'class-validator'

export class CreateTrip {
  @IsString()
  meal: string

  @IsString()
  org: string

  @IsNumber()
  sent_at: number
}
