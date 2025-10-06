import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { employeeProvider } from './employee.provider';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, ...employeeProvider],
})
export class EmployeeModule {}
