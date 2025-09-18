import { Schema } from "mongoose";

export const CountrySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
 {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})