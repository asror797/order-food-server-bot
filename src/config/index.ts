import { config } from 'dotenv'
config({ path: `.env` })

export const PORT = Number(process.env.PORT || 9070)

export const { 
  ORDER_CANCEL_TIME,
  JWT_ACCESS_TOKEN_SECRET_KEY,
  JWT_REFRESH_TOKEN_SECRET_KEY,
} = process.env
