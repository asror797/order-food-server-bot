export interface AttendedUser {
  lunch: string
  cost: number
  user: string
  is_accepted: boolean
  is_canceled: boolean
}

export interface ITrip extends Document {
  meal: string
  sent_at: number
  candidates: AttendedUser[]
  org: string
}
