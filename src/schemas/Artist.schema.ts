import { Schema } from 'mongoose';

export const ArtistSchema = new Schema({
  name : {
    type: String,
    required: true,
  },
  albums: [{
    type: Schema.Types.ObjectId,
    ref: 'Album',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
