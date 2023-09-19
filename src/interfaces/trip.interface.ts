
export interface ITrip extends Document {
  meal: string;
  sent_at: number
  agree_users: string
  disagree_users: string
  org: string
}