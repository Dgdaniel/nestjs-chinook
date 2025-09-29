import { z } from 'zod'
import { Types } from 'mongoose';
export const UpdateGenreDtoSchema = z.object({
  name: z.string().
  min(3, {message: 'Name should be at least 5 characters'})
  .trim().refine(val => val.length >= 5, {message: 'Name should be at least 5 characters'}),
  _id: z.string().
    trim()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Not a valid ID"
    })
}).required();

export type UpdateGenreDto = z.infer<typeof UpdateGenreDtoSchema>
