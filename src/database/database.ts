import { ConnectOptions } from 'mongoose'

const PATH = 'mongodb://localhost:27017/foodbot'
// const PROD_PATH = 'mongodb://gen_user:Woodline123@81.31.246.50:27017/default_db'
// const Link = `mongodb+srv://Woodline123:Woodline123@serverlessinstance0.u7us8qo.mongodb.net/`
const FDB = 'mongodb+srv://doadmin:z74Jg68e30Q2fS9m@db-mongodb-nyc3-93981-0b5e2c65.mongo.ondigitalocean.com/botdb?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-93981'

interface DB_CONNECTION {
  url: string
  options: ConnectOptions
}

export const dbConnection: DB_CONNECTION = {
  url: FDB,
  options: {
    autoIndex: true,
  },
}
