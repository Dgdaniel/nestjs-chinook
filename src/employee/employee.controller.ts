import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee as EmployeePrisma } from '@prisma/client';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('prisma')
  async findAllPrisma(): Promise<EmployeePrisma[]> {
    return this.employeeService.findAllPrisma();
  }

  @Get('prisma/:id')
  async findOne(@Param('id') id: number): Promise<EmployeePrisma | null> {
    return this.employeeService.findOnePrisma(id);
  }

  @Get('sync')
  async  sync (): Promise<void>{
    await this.employeeService.sync();
  }
}
