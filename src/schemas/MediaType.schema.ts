import * as mongoose from 'mongoose';

export const MediaTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})