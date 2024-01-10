import { Schema, model } from 'mongoose'
import { IAdmin } from '../interfaces/admin.interface'

export enum AdminRole {
  SUPER_ADMIN = 'admin',
  COOK = 'cook',
  STOREKEEPER = 'storekeeper',
}

const adminSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true,
    },
    role: {
      type: [
        {
          type: String,
          enum: Object.values(AdminRole),
        },
      ],
      default: [AdminRole.SUPER_ADMIN],
    },
    phone_number: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const adminModel = model<IAdmin & Document>('Admin', adminSchema)
