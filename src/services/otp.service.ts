import redisService from "./redis.service";
import nodefetch from "node-fetch"


class OtpService {

  private redisService = redisService;
  

  public async sendOtp() {
    const optData = await this.redisService.getValue('otp-token');

    console.log(optData)

    if(optData) {
      const formData = new FormData();
      formData.append("mobile_phone","")
      formData.append('message', `WoodlinePro Tasdiqlash kodi: ${5}`);
      formData.append('from', '4546');
  
      const fetchOptions = {
        method: 'POST',
        body: formData, 
        headers: { Authorization: 'Bearer ' + optData },
      };
      
      try {
        const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', fetchOptions);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Assuming the response is JSON, parse it
        const data = await response.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('Error:', error);
      }

    } else {
      return await redisService.refreshOtpToken()
    }


  }

  public refreshToken() {
    
  }

  // public sendOtp(phone_number: string) {

  // }
}


export default OtpService;