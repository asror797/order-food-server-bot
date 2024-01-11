import { IRole } from './../interfaces';
import { Schema, model } from "mongoose";

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
            type: String
          },
          permission: {
            type: Boolean,
            default: false
          },
          actions: {
            type: [
              {
                uri: String,
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
  }
)

export const roleModel = model<IRole & Document>('Role',roleSchema)
