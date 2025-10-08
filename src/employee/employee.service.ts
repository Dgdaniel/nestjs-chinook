import { BadRequestException, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EMPLOYEE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Employee } from './interface/employee.interface';
import { Employee as EmployeePrisma } from '@prisma/client';
import * as dtoPrisma from './dto/createEmployeePrisma.dto';
import { createEmployeeDto } from './dto/createEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    @Inject(EMPLOYEE_MODEL) private readonly model: Model<Employee>,
  ) {}

  async findAllPrisma(): Promise<EmployeePrisma[]> {
    return this.prisma.employee.findMany({
      include: {
        manager: true,
      }
    });
  }

  async  findAll(): Promise<Employee[]> {
    return this.model.find().populate('reportsTo').exec();
  }

  async findOnePrisma(id: number): Promise<EmployeePrisma | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<Employee | null> {
    return this.model.findById(id).populate('reportsTo').exec();
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

  async createPrisma(data: dtoPrisma.createEmployeePrismaDto): Promise<EmployeePrisma> {
    // Valider que le manager existe si reportsTo est fourni
    if (data.reportsTo) {
      const managerExists = await this.prisma.employee.findUnique({
        where: { id: data.reportsTo },
        select: { id: true } // Optimisation : récupérer seulement l'id
      });

      if (!managerExists) {
        throw new NotFoundException(
          `Manager with id ${data.reportsTo} does not exist`
        );
      }
    }

    return this.prisma.employee.create({
      data,
      include: {
        manager: true // Inclure les infos du manager dans la réponse
      }
    });
  }

  async create(data: createEmployeeDto) : Promise<Employee>{
    if (data.reportsTo) {
      let manager  = await this.model.findById( data.reportsTo);
      if (!manager) {
        throw new NotFoundException("Manager with id " + data.reportsTo + " does not exist");
      }
      return  await this.model.create({
        ...data,
        reportsTo: manager._id
      });
    }else{
      return  await this.model.create({
        ...data,
      });
    }

  }
  async update(id: string, data: createEmployeeDto): Promise<Employee |null> {
    // Vérifier que l'employé existe
    const employee = await this.model.findById(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} does not exist`);
    }

    // Valider que le manager existe si reportsTo est fourni
    if (data.reportsTo) {
      // Empêcher qu'un employé soit son propre manager
      if (data.reportsTo === id) {
        throw new BadRequestException(
          'An employee cannot report to themselves',
        );
      }

      const managerExists = await this.model.findById(data.reportsTo);

      if (!managerExists) {
        throw new NotFoundException(
          `Manager with id ${data.reportsTo} does not exist`,
        );
      }
    }

    // Mettre à jour l'employé
    // Peupler les infos du manager

    return this.model
      .findByIdAndUpdate(id, data, {
        new: true, // Retourner le document mis à jour
        runValidators: true, // Exécuter les validateurs du schéma
      })
      .populate('reportsTo');
  }

  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    // Vérifier que l'employé existe
    const employee = await this.model.findById(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} does not exist`);
    }

    // Vérifier si des employés dépendent de celui-ci
    const dependentEmployees = await this.model.countDocuments({
      reportsTo: id
    });

    if (dependentEmployees > 0) {
      throw new BadRequestException(
        `Cannot delete employee: ${dependentEmployees} employee(s) report to this manager`
      );
    }

    await this.model.findByIdAndDelete(id);

    return {
      success: true,
      message: `Employee with id ${id} deleted successfully`
    };
  }

  async updatePrisma(id: number, data: dtoPrisma.createEmployeePrismaDto): Promise<EmployeePrisma> {
    // Vérifier que l'employé existe
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} does not exist`);
    }

    // Valider que le manager existe si reportsTo est fourni
    if (data.reportsTo) {
      // Empêcher qu'un employé soit son propre manager
      if (data.reportsTo === id) {
        throw new BadRequestException('An employee cannot report to themselves');
      }

      const managerExists = await this.prisma.employee.findUnique({
        where: { id: data.reportsTo },
        select: { id: true }
      });

      if (!managerExists) {
        throw new NotFoundException(
          `Manager with id ${data.reportsTo} does not exist`
        );
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data,
      include: {
        manager: true // Inclure les infos du manager dans la réponse
      }
    });
  }

  async deletePrisma(id: number): Promise<{ success: boolean; message?: string }> {
    // Vérifier que l'employé existe
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} does not exist`);
    }

    // Vérifier si des employés dépendent de celui-ci
    const dependentEmployees = await this.prisma.employee.count({
      where: { reportsTo: id }
    });

    if (dependentEmployees > 0) {
      throw new BadRequestException(
        `Cannot delete employee: ${dependentEmployees} employee(s) report to this manager`
      );
    }

    await this.prisma.employee.delete({
      where: { id }
    });

    return {
      success: true,
      message: `Employee with id ${id} deleted successfully`
    };
  }
}
