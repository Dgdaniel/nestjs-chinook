import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer as CustomerPrisma } from '@prisma/client';
import { Customer } from './interface/customer.interface';
import * as createCustomerPrismaDto from './dto/createCustomerPrisma.dto';
import * as updateDto from './dto/updateCustomer.dto';
import * as createCustomerDto from './dto/createCustomer.dto';
import { ZodBody } from '../decorators/zod-body/zod-body.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ========== ROUTES SPÉCIFIQUES (sans paramètres) ==========

  @Get('sync')
  async sync(): Promise<{ success: boolean; message: string }> {
    await this.customerService.sync();
    return {
      success: true,
      message: 'Customer synchronization completed'
    };
  }

  @Get('prisma')
  async findAllPrisma(): Promise<CustomerPrisma[]> {
    return this.customerService.findAllPrisma();
  }

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  // ========== ROUTES POST ==========

  @Post('prisma')
  @ZodBody(createCustomerPrismaDto.createCustomerPrismaSchema)
  async createPrisma(
    @Body() data: createCustomerPrismaDto.createCustomerPrismaDto
  ): Promise<CustomerPrisma> {
    return this.customerService.createPrisma(data);
  }

  @Post()
  @ZodBody(createCustomerDto.createCustomerSchema)
  async create(
    @Body() data: createCustomerDto.createCustomerDto
  ): Promise<Customer> {
    return this.customerService.create(data);
  }

  // ========== ROUTES PUT ==========

  @Put('prisma/:id')
  @ZodBody(createCustomerPrismaDto.createCustomerPrismaSchema)
  async updatePrisma(
    @Param('id') id: string,
    @Body() data: createCustomerPrismaDto.createCustomerPrismaDto
  ): Promise<CustomerPrisma> {
    return this.customerService.updatePrisma(Number(id), data);
  }

  @Put()
  @ZodBody(updateDto.updateCustomerSchema)
  async update(
    @Body() data: updateDto.UpdateCustomerDto
  ): Promise<Customer|null> {
    return this.customerService.update(data.id, data);
  }

  // ========== ROUTES DELETE ==========

  @Delete('prisma/:id')
  async deletePrisma(
    @Param('id') id: string
  ): Promise<{ success: boolean; message?: string }> {
    return this.customerService.deletePrisma(Number(id));
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ): Promise<{ success: boolean; message?: string }> {
    return this.customerService.delete(id);
  }

  // ========== ROUTES GET avec paramètres (en dernier) ==========

  @Get('prisma/:id')
  async findOnePrisma(@Param('id') id: string): Promise<CustomerPrisma> {
    return this.customerService.findOnePrisma(Number(id));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer|null> {
    return this.customerService.findOne(id);
  }
}