
import { Schema } from 'mongoose';

export const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    tracks: [{
        type: Schema.Types.ObjectId,
        ref: 'Track',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})