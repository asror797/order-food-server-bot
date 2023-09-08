import { ConnectOptions } from "mongoose";

/* constants */
const PATH = 'mongodb://localhost:27017/foodbot'

interface DB_CONNECTION {
  url: string;
  options: ConnectOptions
}


export const dbConnection:DB_CONNECTION = {
  url:PATH,
  options: {
    autoIndex: true
  }
}