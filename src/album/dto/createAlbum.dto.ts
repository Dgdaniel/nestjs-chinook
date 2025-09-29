import { z } from 'zod';

export const CreateAlbumDtoSchema = z.object({
  title: z.string()
    .min(3, { message: "Title is required" })
    .trim()
    .refine((val) => val.length > 0, {
      message: "Title cannot be empty or just whitespace"
    }),
  artistId: z.string()
    .min(1, { message: "Artist ID is required" })
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid MongoDB ObjectId format"
    })
}).required();

export type CreateAlbumDto = z.infer<typeof CreateAlbumDtoSchema>;