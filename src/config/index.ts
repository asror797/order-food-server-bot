import { config } from 'dotenv'
config({ path: `.env` })

export const {
  ORDER_CANCEL_TIME,
  JWT_ACCESS_TOKEN_SECRET_KEY,
  JWT_REFRESH_TOKEN_SECRET_KEY,
  BOT_TOKEN,
  DB_URL,
  PORT
} = process.env
