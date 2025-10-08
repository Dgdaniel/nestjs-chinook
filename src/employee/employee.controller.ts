import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee as EmployeePrisma } from '@prisma/client';
import { Employee } from './interface/employee.interface';
import * as createEmployeePrismaDto from './dto/createEmployeePrisma.dto';
import * as createEmployeeDto from './dto/createEmployee.dto';
import { ZodBody } from '../decorators/zod-body/zod-body.decorator';
import  * as updateDto  from './dto/updateEmployee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Routes GET sans paramètres en premier (plus spécifiques)
  @Get('sync')
  async sync(): Promise<void> {
    await this.employeeService.sync();
  }

  @Get('prisma')
  async findAllPrisma(): Promise<EmployeePrisma[]> {
    return this.employeeService.findAllPrisma();
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  // Routes POST
  @Post('prisma')
  @ZodBody(createEmployeePrismaDto.createEmployeePrismaSchema)
  async createPrisma(@Body() data: createEmployeePrismaDto.createEmployeePrismaDto): Promise<EmployeePrisma> {
    return this.employeeService.createPrisma(data);
  }

  @Post()
  @ZodBody(createEmployeeDto.createEmployeeSchema)
  async create(@Body() data: createEmployeeDto.createEmployeeDto) {
    return this.employeeService.create(data);
  }

  @Put()
  @ZodBody(updateDto.updateEmployeeSchema)
  async update(
    @Body() data: updateDto.UpdateEmployeeDto
  ): Promise<Employee | null> {
    return this.employeeService.update(data.id, data);
  }

  // Routes PUT
  @Put('prisma/:id')
  @ZodBody(createEmployeePrismaDto.createEmployeePrismaSchema)
  async updatePrisma(
    @Param('id') id: string,
    @Body() data: createEmployeePrismaDto.createEmployeePrismaDto
  ): Promise<EmployeePrisma> {
    return this.employeeService.updatePrisma(Number(id), data);
  }

  // Routes DELETE
  @Delete('prisma/:id')
  async deletePrisma(@Param('id') id: string): Promise<{ success: boolean; message?: string }> {
    return this.employeeService.deletePrisma(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean; message?: string }> {
    return this.employeeService.delete(id);
  }

  // Routes GET avec paramètres en dernier (moins spécifiques)
  @Get('prisma/:id')
  async findOnePrisma(@Param('id') id: string): Promise<EmployeePrisma | null> {
    return this.employeeService.findOnePrisma(Number(id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee | null> {
    return this.employeeService.findOne(id);
  }
}