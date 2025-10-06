import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma/prisma.service';
import { employeeProvider } from './employee.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, ...employeeProvider],
})
export class EmployeeModule {}
