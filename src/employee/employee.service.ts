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

  async findAllPrisma(): Promise<EmployeePrisma[]> {
    return this.prisma.employee.findMany();
  }

  async findOnePrisma(id: number): Promise<EmployeePrisma | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async sync(): Promise<void> {
    const allPrisma = await this.prisma.employee.findMany();
    const mongoCount = await this.model.countDocuments();

    if (mongoCount === 0) {
      // Créer un map pour retrouver facilement les documents MongoDB
      const mongoMap = new Map();

      // Créer tous les employés
      for (const emp of allPrisma) {
        const doc = await this.model.create({ ...emp, reportsTo: null });
        mongoMap.set(emp.id, doc._id);
      }

      // Mettre à jour les relations
      for (const emp of allPrisma) {
        if (emp.reportsTo && mongoMap.has(emp.id)) {
          const managerMongoId = mongoMap.get(emp.reportsTo);
          if (managerMongoId) {
            await this.model.updateOne(
              { _id: mongoMap.get(emp.id) },
              { reportsTo: managerMongoId }
            );
          }
        }
      }
    }
  }
}
