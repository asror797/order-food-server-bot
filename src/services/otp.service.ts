import redisService from "./redis.service";


class OtpService {

  private redisService = redisService;
  

  public async getToken() {
    const optData = await this.redisService.getValue('sms-info');

    if(optData) {
      console.log(optData)
    } else {

    }

  }

  public refreshToken() {

  }
}


export default OtpService;