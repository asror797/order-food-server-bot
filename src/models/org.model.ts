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
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);


const orgModel = model<IOrg & Document>('Org',orgSchema);


export default orgModel;