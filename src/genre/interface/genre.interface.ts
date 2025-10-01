import { Document } from 'mongoose';

export interface Genre extends Document {
  _id: string;
  name: string;
}