import { Schema, model } from 'mongoose'
import { IPayment } from '../interfaces/payment.interface'

const paymentSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true,
    },
    amount: {
      type: Number,
      defaul: 0,
    },
    type: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const paymentModel = model<IPayment & Document>('Payment', paymentSchema)
