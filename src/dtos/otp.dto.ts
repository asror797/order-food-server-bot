import { IsString } from 'class-validator'

export class OtpInfo {
  @IsString()
  email: string

  @IsString()
  password: string
}
