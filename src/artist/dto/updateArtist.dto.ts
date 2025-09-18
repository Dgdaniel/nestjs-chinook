import { z } from 'zod';
import { Types } from 'mongoose';

export const UpdateArtistDtoSchema = z
  .object({
    id: z.string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format"
      }),
    name: z.string()
      .min(1, { message: "Name is required" })
      .trim()
      .refine((val) => val.length > 0, {
        message: "Name cannot be empty or just whitespace"
      })
      .optional(),
  })
  .required();

export type UpdateArtistDto = z.infer<typeof UpdateArtistDtoSchema>;