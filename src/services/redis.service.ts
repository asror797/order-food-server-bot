import * as redis from 'redis';
import { OtpInfo } from '../dtos/otp.dto';
import nodefetch from "node-fetch"

class RedisService {
  private static instance: RedisService;
  private client: redis.RedisClientType;

  private constructor() {
    this.client = redis.createClient({
        socket: {
          host: 'redis-18770.c300.eu-central-1-1.ec2.cloud.redislabs.com',
          port: 18770
      },
      password:'xey2znL8FzSjE5CEURmA0rakuZLUCx6f'
    });

    //redis://default:xey2znL8FzSjE5CEURmA0rakuZLUCx6f@redis-18770.c300.eu-central-1-1.ec2.cloud.redislabs.com:18770

    // this.client = redis.createClient({
    //   url:'redis://localhost:6379',
    // });

    this.client.connect()

    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });

    this.client.on("error", (error) => {
      console.error(`Error connecting to Redis: ${error}`);
    });
  }

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  // public async connection():Promise<any> {
  //   return await this.client.connect()
  // }

  public async  setValue(key: string, value: string): Promise<string | any> {
    try {
      return await this.client.set(key,value)
    } catch (error) {
      console.log(error)
    }
  }

  public async getValue(key:string): Promise<string | any> {
    try {
      return await this.client.get(key)
    } catch (error) {
      console.log(error)
    }
  }

  public async saveFoodToStore(user: number , food: string , amount: string) {
    try {
      // await this.setValue(user,)
      const store = await this.getValue(`${user}`);
      if(!store) {
        
      } else {

      }
    } catch (error) {
      
    }
  }

  public async getOtpServiceInfo() {
    try {
      return await this.client.get('sms-info')
    } catch (error) {
      console.log(error)
    }
  }

  public async saveOtpServiceInfo(otpInfo:OtpInfo) {
    try {
      const isSaved = await this.client.set('sms-info',JSON.stringify({
        email: otpInfo.email,
        password: otpInfo.password
      }));

      return await this.client.get('sms-info')
    } catch (error) {
      console.log(error)
    }
  }

  public async refreshOtpToken() {
    try {
      let token = await this.client.get('sms-info') 

      if(token) {
        const NewToken: OtpInfo = JSON.parse(token)
        const formData = new FormData();
        formData.append("email",NewToken.email)
        formData.append("password",NewToken.password)

        let response = await nodefetch('https://notify.eskiz.uz/api/auth/login',{
          method:"POST",
          body: JSON.stringify(formData)
        });

        if(response) {
          await this.setValue('otp-token',`${response}`)
        }

        console.log('token',response)

        return await this.getValue('otp-token');
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async saveLoginInfo(phone_number: string , code: string) {

  }
}


export default RedisService.getInstance();