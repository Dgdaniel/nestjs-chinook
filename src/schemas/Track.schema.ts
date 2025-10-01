import mongoose from "mongoose"
import {
  ALBUM_MODEL,
  GENRE_MODEL,
  MEDIA_TYPE_MODEL,
  PLAYLIST_MODEL,
} from '../constants/object.constants';
export const TrackSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    composer: {
        type: String,
    },
    milliseconds: {
        type: Number,
        required: true,
    },
    bytes: {
        type: Number,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    mediaType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MEDIA_TYPE_MODEL,
        required: true,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ALBUM_MODEL,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: GENRE_MODEL,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    playlists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: PLAYLIST_MODEL,
        }
    ],

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})



