import { Artist } from "src/artist/interfaces/artist.interface";

export interface Album  extends Document{
    _id: string;
    title: string;
    artist: Artist;
    createdAt: Date
    updatedAt: Date;
}