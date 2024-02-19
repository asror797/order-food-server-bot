import { Document, Schema, model } from 'mongoose'
import { IProduct, Units } from '../interfaces/product.interface'

const productSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      required: true
    },
    min_amount: {
      type: Number,
      default: 0
    },
    cost: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: Object.values(Units),
      required: true
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const productModel = model<IProduct & Document>('Product', productSchema)
