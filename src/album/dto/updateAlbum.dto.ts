
import { Types } from 'mongoose';
import { z } from 'zod'
export const updateAlbumDto = z.
    object({
        id: z.string()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid ObjectId format"
            }),
        title: z.string()
            .min(1, { message: "Title is required" })
            .trim()
            .refine((val) => val.length > 0, {
                message: "Title cannot be empty or just whitespace"
            })
            .optional(),
        artistId: z.string()
            .min(1, { message: "Artist ID is required" })
            .trim()
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Not a valid ID"
            })
            .optional()
    })
    .required();