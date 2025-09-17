import { Document } from 'mongoose';

export interface Artist extends Document {
    readonly _id: string;
    readonly name: string;
    readonly createdAt: Date;
}