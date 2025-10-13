import { Controller, Get } from '@nestjs/common';
import InvoiceService from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('sync')
  async sync() {
    await this.invoiceService.sync();
  }

  @Get()
  async findAll(){
    return this.invoiceService.findAll();
  }
}
