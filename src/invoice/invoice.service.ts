import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CUSTOMER_MODEL, INVOICE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Invoice } from './interface/invoice.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '../customer/interface/customer.interface';
import { CreateInvoiceDto, CreateInvoiceSchema } from './dto/createInvoice.dto';
import { UpdateInvoiceDto, UpdateInvoiceSchema } from './dto/updateInvoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(INVOICE_MODEL) private readonly model: Model<Invoice>,
    @Inject(CUSTOMER_MODEL) private readonly customerModel: Model<Customer>,
    private readonly prisma: PrismaService
  ) {}

  logger = new Logger('InvoiceService');

  // ==================== SYNC ====================

  async sync(): Promise<void> {
    const allMongo = await this.model.find().exec();

    if (allMongo.length > 0) {
      this.logger.log('Sync skipped: MongoDB already contains data.');
      return;
    }

    const allPrisma = await this.prisma.invoice.findMany({
      include: {
        customer: true
      }
    });

    this.logger.log(`Starting sync of ${allPrisma.length} invoices...`);

    const allCustomers = await this.customerModel.find().exec();
    const customerMap = new Map(
      allCustomers.map(c => [`${c.firstName}_${c.lastName}`, c])
    );

    let countSuccess: number = 0;
    let countError: number = 0;
    const errors: Array<{ invoiceId: any; reason: string }> = [];

    const batchSize = 100;
    for (let i = 0; i < allPrisma.length; i += batchSize) {
      const batch = allPrisma.slice(i, i + batchSize);

      const invoicesToCreate = batch
        .map(data => {
          const customerKey = `${data.customer.firstName}_${data.customer.lastName}`;
          const customer = customerMap.get(customerKey);

          if (!customer) {
            errors.push({
              invoiceId: data.id,
              reason: `Customer not found: ${data.customer.firstName} ${data.customer.lastName}`
            });
            return null;
          }

          return {
            ...data,
            customer: customer._id,
            customerId: undefined
          };
        })
        .filter(Boolean);

      try {
        if (invoicesToCreate.length > 0) {
          await this.model.insertMany(invoicesToCreate, { ordered: false });
          countSuccess += invoicesToCreate.length;
        }
      } catch (e: any) {
        if (e.writeErrors) {
          countError += e.writeErrors.length;
          countSuccess += invoicesToCreate.length - e.writeErrors.length;

          e.writeErrors.forEach((err: any) => {
            errors.push({
              invoiceId: invoicesToCreate[err.index]?.id || 'unknown',
              reason: err.errmsg || err.message
            });
          });
        } else {
          countError += invoicesToCreate.length;
          this.logger.error('Batch insert failed:', e);
        }
      }
    }

    countError += errors.length;

    this.logger.log(
      `Sync completed: ${countSuccess} invoices created, ${countError} errors.`
    );

    if (errors.length > 0) {
      this.logger.warn('Errors details:', errors.slice(0, 10));
    }
  }

  // ==================== CREATE ====================

  async create(invoice: CreateInvoiceDto): Promise<Invoice> {
    this.logger.log(`Creating invoice for customer: ${invoice.customerId}`);

    // Validation avec Zod
    const validatedData = CreateInvoiceSchema.parse(invoice);

    // Vérifier que le customer existe
    const customer = await this.customerModel.findById(validatedData.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${validatedData.customerId} not found`);
    }

    return this.model.create({
      ...validatedData,
      customer: validatedData.customerId
    });
  }

  // ==================== READ ====================

  async findAll(): Promise<Invoice[]> {
    return this.model.find().populate('customer').exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.model.findById(id).populate('customer').exec();

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByCustomer(customerId: string): Promise<Invoice[]> {
    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.model.find({ customer: customerId }).populate('customer').exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return this.model
      .find({
        invoiceDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('customer')
      .exec();
  }

  async findByBillingCity(city: string): Promise<Invoice[]> {
    return this.model
      .find({
        billingCity: new RegExp(city, 'i')
      })
      .populate('customer')
      .exec();
  }

  async findByTotalRange(minTotal: number, maxTotal: number): Promise<Invoice[]> {
    return this.model
      .find({
        total: {
          $gte: minTotal,
          $lte: maxTotal
        }
      })
      .populate('customer')
      .exec();
  }

  // ==================== UPDATE ====================

  async update(invoice: UpdateInvoiceDto): Promise<Invoice> {
    this.logger.log(`Updating invoice: ${invoice.id}`);

    // Validation avec Zod
    const validatedData = UpdateInvoiceSchema.parse(invoice);

    // Extraire l'id et préparer les données à mettre à jour
    const { id, customerId, ...dataToUpdate } = validatedData;

    // Si le customer change, vérifier qu'il existe
    if (customerId) {
      const customer = await this.customerModel.findById(customerId);
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
      // Ajouter le customer aux données de mise à jour
      (dataToUpdate as any).customer = customerId;
    }

    const updatedInvoice = await this.model.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    ).populate('customer');

    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return updatedInvoice;
  }

  async updatePartial(id: string, partialData: Partial<UpdateInvoiceDto>): Promise<Invoice> {
    this.logger.log(`Partially updating invoice: ${id}`);

    const updatedInvoice = await this.model.findByIdAndUpdate(
      id,
      partialData,
      { new: true }
    ).populate('customer');

    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return updatedInvoice;
  }

  // ==================== DELETE ====================

  async remove(id: string): Promise<Invoice> {
    this.logger.log(`Deleting invoice: ${id}`);

    const deletedInvoice = await this.model.findByIdAndDelete(id).populate('customer');

    if (!deletedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return deletedInvoice;
  }

  async removeByCustomer(customerId: string): Promise<{ deletedCount: number }> {
    this.logger.log(`Deleting all invoices for customer: ${customerId}`);

    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const result = await this.model.deleteMany({ customer: customerId });

    return { deletedCount: result.deletedCount };
  }

  // ==================== STATISTICS ====================

  async count(): Promise<number> {
    return this.model.countDocuments();
  }

  async getStats(): Promise<{
    totalInvoices: number;
    totalAmount: number;
    averageAmount: number;
    maxAmount: number;
    minAmount: number;
  }> {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: '$total' },
          averageAmount: { $avg: '$total' },
          maxAmount: { $max: '$total' },
          minAmount: { $min: '$total' }
        }
      }
    ]);

    return stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      averageAmount: 0,
      maxAmount: 0,
      minAmount: 0
    };
  }

  async getStatsByCustomer(customerId: string): Promise<{
    totalInvoices: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const stats = await this.model.aggregate([
      {
        $match: { customer: customer._id }
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: '$total' },
          averageAmount: { $avg: '$total' }
        }
      }
    ]);

    return stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      averageAmount: 0
    };
  }

  async getInvoicesByMonth(year: number): Promise<any[]> {
    return this.model.aggregate([
      {
        $match: {
          invoiceDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$invoiceDate' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
  }
}