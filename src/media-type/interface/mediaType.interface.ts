import { Document } from 'mongoose';

export interface MediaType extends Document{
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}