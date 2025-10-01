import { Document } from 'mongoose';

export interface Playlist extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}