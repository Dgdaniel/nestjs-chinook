import { Inject, Injectable, Logger } from '@nestjs/common';
import { CUSTOMER_MODEL, INVOICE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Invoice } from './interface/invoice.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '../customer/interface/customer.interface';

@Injectable()
export class InvoiceService {
  constructor(@Inject(INVOICE_MODEL) private readonly model: Model<Invoice>,
              @Inject(CUSTOMER_MODEL) private readonly customerModel: Model<Customer>,
              private readonly prisma: PrismaService) {

  }
  logger = new Logger("InvoiceService");

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

    // Optimisation : récupérer tous les customers MongoDB une seule fois
    const allCustomers = await this.customerModel.find().exec();

    // Créer une Map pour un accès rapide
    const customerMap = new Map(
      allCustomers.map(c => [`${c.firstName}_${c.lastName}`, c])
    );

    let countSuccess: number = 0;
    let countError: number = 0;
    const errors: Array<{ invoiceId: any; reason: string }> = [];

    // Traiter par batch pour éviter de surcharger la DB
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
            customerId: undefined // Retirer l'ID Prisma si présent
          };
        })
        .filter(Boolean); // Retirer les nulls

      try {
        if (invoicesToCreate.length > 0) {
          await this.model.insertMany(invoicesToCreate, { ordered: false });
          countSuccess += invoicesToCreate.length;
        }
      } catch (e) {
        // insertMany avec ordered: false continue même en cas d'erreur
        // @ts-ignore
        if (e.writeErrors) {
          // @ts-ignore
          countError += e.writeErrors.length;
          // @ts-ignore
          countSuccess += invoicesToCreate.length - e.writeErrors.length;

          // @ts-ignore
          e.writeErrors.forEach((err: { index: string | number; errors: any; }) => {
            errors.push({
              invoiceId: invoicesToCreate[err.index]?.id || 'unknown',
              reason: err.errors
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
      this.logger.warn('Errors details:', errors.slice(0, 10)); // Log les 10 premières erreurs
    }
  }

  async findAll(): Promise<Invoice[]> {
    return this.model.find().populate('customer')
      .exec();
  }
}
