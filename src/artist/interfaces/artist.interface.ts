import { Document } from 'mongoose';
import { Album } from 'src/album/interface/album.interface';

export interface Artist extends Document {
    id: string;
    name: string;
    albums?: Album[];
    createdAt: Date;
    updatedAt: Date;
}