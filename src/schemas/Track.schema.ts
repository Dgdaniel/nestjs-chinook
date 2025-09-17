import mongoose from "mongoose"
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
        ref: 'MediaType',
        required: true,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})



