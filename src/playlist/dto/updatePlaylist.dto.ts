import { z } from 'zod';
import { Types } from 'mongoose';

export const UpdatePlaylistDtoSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name should be at least 5 characters' })
      .trim()
      .refine((val) => val.length >= 5, {
        message: 'Name should be at least 5 characters',
      })
      .optional(),
    id: z
      .string()
      .trim()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Not a valid ID',
      }),
    trackId: z
      .array(
        z.string().trim().refine((val) => Types.ObjectId.isValid(val), {
          message: 'Each trackId must be a valid ObjectId',
        })
      )
      .optional(),
    removeTrackId: z
      .array(
        z.string().trim().refine((val) => Types.ObjectId.isValid(val), {
          message: 'Each removeTrackId must be a valid ObjectId',
        })
      )
      .optional(),
  })
  .required();

export type UpdatePlaylistDto = z.infer<typeof UpdatePlaylistDtoSchema>;