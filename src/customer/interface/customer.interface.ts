import { Document } from 'mongoose';
import { Employee } from '../../employee/interface/employee.interface';

export interface Customer extends Document {
  firstName: string;
  lastName: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email: string;
  supportRep?: Employee;
  createdAt?: Date;
  updatedAt?: Date;
}