import * as mongoose from 'mongoose';


export const AlbumSchem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
})