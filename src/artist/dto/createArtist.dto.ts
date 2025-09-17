import { z } from 'zod';

export const CreateArtistDtoSchema =  z
.object({
    name: z.string().min(1, { message: "Name is required" }),
})
.required();

export type CreateArtistDto = z.infer<typeof CreateArtistDtoSchema>;