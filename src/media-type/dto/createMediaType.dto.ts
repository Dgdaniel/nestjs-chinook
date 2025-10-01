import {z } from 'zod';
export const CreateMediaTypeDtoSchema = z.object({
  name: z.string().min(3, {message: "The name is required"}).refine(val => val.length > 0, {
    message: "The name is required"
  }),
}).required();
export type CreateMediaTypeDto = z.infer<typeof CreateMediaTypeDtoSchema>