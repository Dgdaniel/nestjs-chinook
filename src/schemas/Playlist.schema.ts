
import mongoose, { Schema } from 'mongoose';
import { TRACK_MODEL } from '../constants/object.constants';

export const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: TRACK_MODEL,
  }],
},{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})