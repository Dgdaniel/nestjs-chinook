import {z} from "zod";
import { Types } from 'mongoose';

export const CreateTrackDtoSchema =  z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name should be at least 5 characters' })
      .trim()
      .refine((val) => val.length >= 5, {
        message: 'Name should be at least 5 characters',
      }),
    composer: z.string().optional(),
    milliseconds: z.number(),
    bytes: z.number(),
    unitPrice: z.number().min(0.99),
    mediaTypeId: z
      .string()
      .trim()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Not a valid ID',
      }),
    albumId: z
      .string()
      .trim()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Not a valid ID',
      }),
    genreId: z
      .string()
      .trim()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Not a valid ID',
      }),
  })
  .required();
export type CreateTrackDto = z.infer<typeof CreateTrackDtoSchema>
