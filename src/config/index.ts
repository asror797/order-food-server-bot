import { config } from 'dotenv'
config({ path: `.env` })

const DEFAULTS = {
  JWT_ACCESS_TOKEN_SECRET_KEY: 'default_access_token_secret_key',
  JWT_REFRESH_TOKEN_SECRET_KEY: 'default_refresh_token_secret_key',
  JWT_ACCESS_TOKEN_EXPIRY: '15m',
  JWT_REFRESH_TOKEN_EXPIRY: '7d',
  DB_URL: 'mongodb://localhost:27017/woodlinebot',
  PORT: '3000',
  BOT_TOKEN: '6630953879:AAGUZZ7aLYFd8fqnCAxUG6F1rejIO1QR75g'
}

export const DB_URL = process.env.DB_URL || DEFAULTS.DB_URL
export const PORT = process.env.PORT || DEFAULTS.PORT
export const JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY ||
  DEFAULTS.JWT_ACCESS_TOKEN_SECRET_KEY

export const JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY ||
  DEFAULTS.JWT_REFRESH_TOKEN_SECRET_KEY

export const JWT_ACCESS_TOKEN_EXPIRY =
  process.env.JWT_ACCESS_TOKEN_EXPIRY || DEFAULTS.JWT_ACCESS_TOKEN_EXPIRY

export const JWT_REFRESH_TOKEN_EXPIRY =
  process.env.JWT_REFRESH_TOKEN_EXPIRY || DEFAULTS.JWT_REFRESH_TOKEN_EXPIRY

export const BOT_TOKEN = process.env.BOT_TOKEN || DEFAULTS.BOT_TOKEN
