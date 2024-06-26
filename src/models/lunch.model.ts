import { Schema, model } from 'mongoose'
import { ILunch } from '@interfaces'
import { Document } from 'mongoose'

const lunchSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    base: {
      type: Schema.Types.ObjectId,
      ref: 'LunchBase'
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
            default: 0
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
    percent_cook: {
      type: Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const lunchModel = model<ILunch & Document>('Lunch', lunchSchema)
