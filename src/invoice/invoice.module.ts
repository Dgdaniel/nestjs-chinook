import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { invoiceProvider } from './invoice.provider';
import { InvoiceService } from './invoice.service';
import { customerProvider } from '../customer/customer.provider';

@Module({
  controllers: [InvoiceController],
  providers: [
    ...invoiceProvider,
    ...customerProvider,
    InvoiceService
  ]
})
export class InvoiceModule {}
