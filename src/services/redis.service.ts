import * as redis from 'redis';

class RedisService {
  private static instance: RedisService;
  private client: redis.RedisClientType;

  private constructor() {
    // this.client = redis.createClient({
    //     socket: {
    //       host: 'redis-15527.c13.us-east-1-3.ec2.cloud.redislabs.com',
    //       port: 15527
    //   },
    //   password:'ov92x5xCUzpDhFEngoBS64euVfIHZUhY'
    // });

    this.client = redis.createClient({
      url:'redis://localhost:6379',
    });

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
}


export default RedisService.getInstance();