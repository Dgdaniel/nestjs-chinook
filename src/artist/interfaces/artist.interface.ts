import { Document } from 'mongoose';
import { Album } from 'src/album/interface/album.interface';

export interface Artist extends Document {
    _id: string;
    name: string;
    albums?: Album[];
    createdAt: Date;
    updatedAt: Date;
}