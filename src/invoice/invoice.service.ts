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
    let allMongo = await this.model.find().exec();
    let countUpdate: number = 0
    if (allMongo.length === 0) {
      let allPrisma = await this.prisma.invoice.findMany({
        include: {
          customer: true
        }
      })

      for (let data of allPrisma) {
        let customer = await this.customerModel.findOne(
          {
            where: {
              firstName: data.customer.firstName,
              lastName: data.customer.lastName
            }
          }
        )
        if (customer) {
          try {
            this.logger.log('customer', { customer });
            await this.model.create({
              ...data,
              customer: customer

            })
            countUpdate++
          }catch (e){
            countUpdate--
            console.log(e)
          }

        }
      }

      this.logger.log(`successfully created ${countUpdate} invoices successfully.`);
    }
  }
}
