import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { customerProvider } from './customer.provider';
import { employeeProvider } from '../employee/employee.provider';

@Module({
  providers: [CustomerService,
    ...customerProvider,
    ...employeeProvider
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
