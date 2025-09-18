import { z } from 'zod';

export const CreateArtistDtoSchema = z
  .object({
    name: z.string()
      .min(1, { message: "Name is required" })
      .trim()
      .refine((val) => val.length > 0, { 
        message: "Name cannot be empty or just whitespace" 
      }),
  })
  .required();

export type CreateArtistDto = z.infer<typeof CreateArtistDtoSchema>;