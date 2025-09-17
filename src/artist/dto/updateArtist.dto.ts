import { z } from 'zod';

export const UpdateArtistDtoSchema =  z
.object({
    id: z.number().positive({ message: "ID must be a positive number" }).min(1, { message: "ID must be at least 1" }),
    name: z.string().min(1, { message: "Name is required" }).optional(),
})
.required();

export type UpdateArtistDto = z.infer<typeof UpdateArtistDtoSchema>;