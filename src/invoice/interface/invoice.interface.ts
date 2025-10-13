import { Customer } from '@prisma/client';

export interface Invoice extends Document {
  invoiceDate: Date;
  invoiceAddress: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  total: number;
  customer: Customer;
  created: Date;
}