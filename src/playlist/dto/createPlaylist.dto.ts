import {z} from "zod";

export const CreatePlaylistDtoSchema = z.object({
  name: z.string().min(3, {message: 'Name is required'})
    .trim()
    .refine((value) => value.trim().length > 0, {message: 'Name cannot be empty'}),
}).required();

export type CreatePlaylistDto = z.infer<typeof CreatePlaylistDtoSchema>
