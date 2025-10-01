import * as mongoose from 'mongoose';


export const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},
  {
    query: {
      byArtistId(artistId) {
        return this.where({
          artist: {
            _id: artistId,
          }
        })
      }
    },
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  })