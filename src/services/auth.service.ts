import userModel from "../models/user.model";
import OtpService from "./otp.service";

class AuthService {
  private otpService = new OtpService()
  private users = userModel;
  private admins = [
    {
      phone_number: '+998913650221'
    }
  ]

  public loginAdmin(phone_number: string) {
    
  }
}


export default AuthService;