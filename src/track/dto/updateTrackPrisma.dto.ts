import { z } from 'zod';

export const UpdateTrackPrismaDtoSchema = z
  .object({
    id: z.number().positive(),
    name: z
      .string()
      .min(4, { message: 'Name should be at least 4 characters' })
      .trim()
      .refine((val) => val.length >= 4, {
        message: 'Name should be at least 4 characters',
      }),
    composer: z.string().optional(),
    milliseconds: z.number(),
    bytes: z.number(),
    unitPrice: z.number().min(0.99),
    mediaTypeId: z.number().positive(),
    albumId: z.number().positive(),
    genreId: z.number().positive(),
  })
  .required();

export type UpdateTrackPrismaDto = z.infer<typeof UpdateTrackPrismaDtoSchema>;
