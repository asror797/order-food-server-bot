import { IRole } from './../interfaces';
import { Document, Schema, model } from "mongoose";

const roleSchema: Schema =  new Schema(
  {
    title: {
      type: String,
      unique: true
    },
    modules: {
      type: [
        {
          uri: {
            type: String,
            required: true
          },
          permission: {
            type: Boolean,
            default: false
          },
          actions: {
            type: [
              {
                uri: {
                  type: String,
                  required: true
                },
                permission: {
                  type: Boolean,
                  default: false
                }
              }
            ],
            default: []
          }
        },
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const roleModel = model<IRole & Document>('Role',roleSchema)
