import * as mongoose from 'mongoose';


export const AlbumSchem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    createdAt : {
        type: Date,
        default : Date.now,
    }
},
 {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})