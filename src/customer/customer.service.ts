import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Customer } from './interface/customer.interface';
import { Employee } from '../employee/interface/employee.interface';
import { Customer as CustomerPrisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as dtoMongo from './dto/createCustomer.dto';
import * as dtoPrisma from './dto/createCustomerPrisma.dto';
import { CUSTOMER_MODEL, EMPLOYEE_MODEL } from '../constants/object.constants';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_MODEL) private readonly customerModel: Model<Customer>,
    @Inject(EMPLOYEE_MODEL) private readonly employeeModel: Model<Employee>,
    private prisma: PrismaService,
  ) {}
  logger = new Logger('CustomerService');

  // ========== MONGODB CRUD ==========

  async create(data: dtoMongo.createCustomerDto): Promise<Customer> {
    if (data.supportRep) {
      const employeeExists = await this.employeeModel.findById(data.supportRep);
      if (!employeeExists) {
        throw new NotFoundException(
          `Employee with id ${data.supportRep} not found`,
        );
      }
    }

    const customer = new this.customerModel(data);
    return customer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel
      .find()
      .populate('supportRep', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<Customer | null> {
    const customer = await this.customerModel
      .findById(id)
      .populate('supportRep', 'firstName lastName email')
      .exec();

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async update(
    id: string,
    data: dtoMongo.createCustomerDto,
  ): Promise<Customer | null> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (data.supportRep) {
      const employeeExists = await this.employeeModel.findById(data.supportRep);
      if (!employeeExists) {
        throw new NotFoundException(
          `Employee with id ${data.supportRep} not found`,
        );
      }
    }

    return await this.customerModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('supportRep')
      .exec();
  }

  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const customer = await this.customerModel.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    await this.customerModel.findByIdAndDelete(id);

    return {
      success: true,
      message: `Customer deleted successfully`,
    };
  }

  // ========== PRISMA CRUD ==========

  async createPrisma(
    data: dtoPrisma.createCustomerPrismaDto,
  ): Promise<CustomerPrisma> {
    if (data.supportRepId) {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id: data.supportRepId },
        select: { id: true },
      });

      if (!employeeExists) {
        throw new NotFoundException(
          `Employee with id ${data.supportRepId} not found`,
        );
      }
    }

    return this.prisma.customer.create({
      data,
      include: {
        supportRep: true,
      },
    });
  }

  async findAllPrisma(): Promise<CustomerPrisma[]> {
    return this.prisma.customer.findMany({
      include: {
        supportRep: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findOnePrisma(id: number): Promise<CustomerPrisma> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        supportRep: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async updatePrisma(
    id: number,
    data: dtoPrisma.createCustomerPrismaDto,
  ): Promise<CustomerPrisma> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    if (data.supportRepId) {
      const employeeExists = await this.prisma.employee.findUnique({
        where: { id: data.supportRepId },
        select: { id: true },
      });

      if (!employeeExists) {
        throw new NotFoundException(
          `Employee with id ${data.supportRepId} not found`,
        );
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data,
      include: {
        supportRep: true,
      },
    });
  }

  async deletePrisma(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Customer with id ${id} deleted successfully`,
    };
  }

  async sync(): Promise<void> {
    const allPrisma = await this.prisma.customer.findMany({
      include: {
        supportRep: true
      }
    });

    const mongoCount = await this.customerModel.countDocuments();

    if (mongoCount === 0) {
      console.log(`Starting sync: ${allPrisma.length} customers to synchronize`);

      // Créer un map des employés Prisma -> MongoDB
      const employeeMap = new Map<number, string>();

      const allMongoEmployees = await this.employeeModel.find();
      const allPrismaEmployees = await this.prisma.employee.findMany();

      // Mapper les IDs des employés
      for (const prismaEmp of allPrismaEmployees) {
        const mongoEmp = allMongoEmployees.find(
          me => me.firstName === prismaEmp.firstName &&
            me.lastName === prismaEmp.lastName &&
            me.email === prismaEmp.email
        );

        if (mongoEmp) {
          employeeMap.set(prismaEmp.id, mongoEmp._id.toString());
        }
      }

      // Préparer les données pour insertion en masse
      const customersToInsert = allPrisma.map(customer => ({
        firstName: customer.firstName,
        lastName: customer.lastName,
        company: customer.company,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.postalCode,
        phone: customer.phone,
        fax: customer.fax,
        email: customer.email,
        supportRep: customer.supportRepId && employeeMap.has(customer.supportRepId)
          ? employeeMap.get(customer.supportRepId)
          : null
      }));

      // Insertion en masse
      await this.customerModel.insertMany(customersToInsert);

      this.logger.log(`Sync completed: ${customersToInsert.length} customers synchronized`);
    } else {
      this.logger.log('Sync skipped: MongoDB already contains customer data');
    }
  }
}