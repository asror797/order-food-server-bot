import { Document, Schema, model } from 'mongoose'
import { IOrder } from '../interfaces/order.interface'

const orderSchema: Schema = new Schema(
  {
    total_cost: {
      type: Number,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foods: {
      type: [
        {
          food: {
            type: Schema.Types.ObjectId,
            ref: 'Food',
            required: true,
          },
          amount: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    is_canceled: {
      type: Boolean,
      default: false,
    },
    is_accepted: {
      type: Boolean,
      default: false,
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export const orderModel = model<IOrder & Document>('Order', orderSchema)
