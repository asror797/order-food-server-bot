import { Schema, model } from "mongoose";
import { IOrg } from "../interfaces/org.interface";


const orgSchema: Schema = new Schema(
  {
    name_org: {
      type: String
    },
    is_active: {
      type: Boolean,
      default: false
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    group_a_id: {
      type: Number,
      default: null
    },
    group_b_id: {
      type: Number,
      default: null
    },
    trip_timeout: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);


const orgModel = model<IOrg & Document>('Org',orgSchema);


export default orgModel;