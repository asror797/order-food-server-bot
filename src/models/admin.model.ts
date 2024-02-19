import { Schema, model } from 'mongoose'
import { IAdmin } from '../interfaces/admin.interface'

const adminSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    phone_number: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const adminModel = model<IAdmin & Document>('Admin', adminSchema)
