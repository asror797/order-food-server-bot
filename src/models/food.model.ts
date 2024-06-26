import { Document, Schema, model } from 'mongoose'
import { CategoryEnum, IFood } from '@interfaces'

const foodSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      default: 0
    },
    img: {
      type: String,
      default:
        'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
    },
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          amount: {
            type: Number,
            required: true
          }
        }
      ],
      default: []
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },
    category: {
      type: String,
      enum: Object.values(CategoryEnum),
      required: true
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const foodModel = model<IFood & Document>('Food', foodSchema)
