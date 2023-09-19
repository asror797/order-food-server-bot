import { ConnectOptions } from "mongoose";

/* constants */
const PATH = 'mongodb://localhost:27017/foodbot'
const PROD_PATH = 'mongodb+srv://doadmin:U8N1CoMQ57W49f06@db-mongodb-fra1-82679-5f731662.mongo.ondigitalocean.com/botdb?tls=true&authSource=admin'

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