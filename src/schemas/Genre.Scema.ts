import mongoose from "mongoose";


export const GenreSchema = new mongoose.Schema(({
    name: {
        type: String,
        required: true
    }
}))
