import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EMPLOYEE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Employee } from './interface/employee.interface';
import { Employee as EmployeePrisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    @Inject(EMPLOYEE_MODEL) private readonly model: Model<Employee>,
  ) {}

  async findAllPrisma() : Promise<EmployeePrisma[]> {
    return this.prisma.employee.findMany();
  }

  async findOnePrisma(id: number) : Promise<EmployeePrisma| null> {
    return this.prisma.employee.findUnique({
      where: { id }
    })
  }




}
