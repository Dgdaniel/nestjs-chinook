import { Document } from 'mongoose';

export interface Artist extends Document {
    _id: string;
    name: string;
    createdAt: Date;
}