import {
  DATABASE_CONNECTION,
  INVOICE_MODEL,
} from '../constants/object.constants';
import { Connection } from 'mongoose';
import { InvoiceSchema } from '../schemas/Invoice.schema';

export const invoiceProvider = [{
  provide: INVOICE_MODEL,
  useFactory: (connection: Connection) => connection.model(INVOICE_MODEL, InvoiceSchema),
  inject: [DATABASE_CONNECTION],
}]