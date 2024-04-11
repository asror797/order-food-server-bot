import { UserList } from './user-retrieve-all.interface'

export interface UserRegisterPayload {
  telegramId: number
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface UserRegisterReturn {
  telegramId: number
  phoneNumber: string
}

export interface UserCheckResponse {
  isExist: boolean
  user: UserList | null | undefined
}
