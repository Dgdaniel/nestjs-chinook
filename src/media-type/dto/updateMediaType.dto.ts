import { Types } from 'mongoose';
import { z } from 'zod';

export const UpdateMediaTypeDtoSchema = z
  .object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId format',
    }),
    name: z
      .string()
      .trim()
      .min(3)
      .refine((val) => val.length > 0, {
        message: 'Name should be at least 3 characters.',
      }),
  })
  .required();

export type UpdateMediaTypeDto = z.infer<typeof UpdateMediaTypeDtoSchema>;
