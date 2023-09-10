import userModel from "../models/user.model";
import OtpService from "./otp.service";
import { formatPhoneNumber } from "../utils/phoneNumberFormatter";
import { httException } from "../exceptions/httpException";

class AuthService {
  private otpService = new OtpService()
  private users = userModel;
  private admins = [
    {
      phone_number: '+998913650221'
    }
  ]

  public loginAdmin(phone_number: string) {
    // validate phone_number
    const validatedPhoneNumber = formatPhoneNumber(phone_number);
    if(!validatedPhoneNumber) throw new httException(400,'invalid format of phone_number')

    const isExist = this.admins.find((e) => e.phone_number == `+998${validatedPhoneNumber}`)

    if(!isExist) throw new httException(400,'not found admin')

    return "ok"
  }
}


export default AuthService;