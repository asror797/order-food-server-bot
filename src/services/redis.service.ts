import * as redis from 'redis'

class RedisService {
  private static instance: RedisService
  private client: redis.RedisClientType

  private constructor() {
    this.client = redis.createClient({
      url: 'redis://localhost:6379'
    })

    this.client.connect()

    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })

    this.client.on('error', (error) => {
      console.error(`Error connecting to Redis: ${error}`)
    })
  }

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  public async setValue(key: string, value: string): Promise<string | any> {
    try {
      return await this.client.set(key, value)
    } catch (error) {
      console.log(error)
    }
  }

  public async getValue(key: string): Promise<string | any> {
    try {
      return await this.client.get(key)
    } catch (error) {
      console.log(error)
    }
  }

  public async saveFoodToStore(user: number, food: string, amount: string) {
    try {
      console.log(amount)
      console.log(food)
      const store = await this.getValue(`${user}`)
      if (!store) {
      } else {
      }
    } catch (error) {}
  }
}

export default RedisService.getInstance()
