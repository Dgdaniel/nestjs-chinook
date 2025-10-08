import {
  CUSTOMER_MODEL,
  DATABASE_CONNECTION,
} from '../constants/object.constants';
import { Connection } from 'mongoose';
import { CustomerSchema } from '../schemas/Customer.schema';

export const customerProvider = [{
  provide: CUSTOMER_MODEL,
  useFactory: (connection: Connection) => connection.model(CUSTOMER_MODEL, CustomerSchema),
  inject: [DATABASE_CONNECTION],
}]