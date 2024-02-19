import { Schema, model } from 'mongoose'
import { IUser, UserRole } from '../interfaces/user.interface'

const userSchema: Schema = new Schema(
  {
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    phone_number: {
      type: String
    },
    telegram_id: {
      type: Number,
      nullable: false
    },
    is_active: {
      type: Boolean,
      default: false
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    balance: {
      type: Number,
      default: 0
    },
    language_code: {
      type: String,
      default: 'uz'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const userModel = model<IUser & Document>('User', userSchema)
