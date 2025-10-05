import { Connection } from 'mongoose';
import {
  DATABASE_CONNECTION,
  EMPLOYEE_MODEL,
} from '../constants/object.constants';
import { EmployeeSchema } from '../schemas/Employee.schema';

export const employeeProvider = [
  {
    provide: EMPLOYEE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(EMPLOYEE_MODEL, EmployeeSchema),
    inject: [DATABASE_CONNECTION],
  },
];
