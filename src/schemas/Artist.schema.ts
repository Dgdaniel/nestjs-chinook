import * as mongoose from 'mongoose';

export const ArtistSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
