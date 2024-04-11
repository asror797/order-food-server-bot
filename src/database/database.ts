import { ConnectOptions } from 'mongoose'
import { DB_URL } from '@config'

if (!DB_URL) throw new Error('Database url NotFound')

interface DB_CONNECTION {
  url: string
  options: ConnectOptions
}

export const dbConnection: DB_CONNECTION = {
  url: DB_URL,
  options: {
    autoIndex: true
  }
}
