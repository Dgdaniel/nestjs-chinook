import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import * as createInvoiceDto_1 from './dto/createInvoice.dto';
import * as updateInvoiceDto_1 from './dto/updateInvoice.dto';
import { ZodBody } from '../decorators/zod-body/zod-body.decorator';
import { AppExceptionFilter } from '../common/filter/appExceptionFilter';
import { TransformInterceptor } from '../common/interceptors/transform/transform.interceptor';

@Controller('invoice')
@UseFilters(AppExceptionFilter) // config at class level
@UseInterceptors(TransformInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // ==================== SYNC ====================
  // @UseFilters(AppExceptionFilter) or a method level
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async sync() {
    await this.invoiceService.sync();
    return {
      message: 'Sync completed successfully',
    };
  }

  // ==================== CREATE ====================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ZodBody(createInvoiceDto_1.CreateInvoiceSchema)
  async create(@Body() createInvoiceDto: createInvoiceDto_1.CreateInvoiceDto) {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    return {
      message: 'Invoice created successfully',
      data: invoice,
    };
  }

  // ==================== READ ====================

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('city') city?: string,
    @Query('minTotal') minTotal?: string,
    @Query('maxTotal') maxTotal?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Filtrage par customer
    if (customerId) {
      return await this.invoiceService.findByCustomer(customerId)
      /*return {
        message: 'Invoices retrieved successfully',
        data: invoices,
        count: invoices.length,
      };*/
    }

    // Filtrage par ville
    if (city) {
      const invoices = await this.invoiceService.findByBillingCity(city);
      return {
        message: 'Invoices retrieved successfully',
        data: invoices,
        count: invoices.length,
      };
    }

    // Filtrage par montant
    if (minTotal && maxTotal) {
      const invoices = await this.invoiceService.findByTotalRange(
        parseFloat(minTotal),
        parseFloat(maxTotal),
      );
      return {
        message: 'Invoices retrieved successfully',
        data: invoices,
        count: invoices.length,
      };
    }

    // Filtrage par date
    if (startDate && endDate) {
      const invoices = await this.invoiceService.findByDateRange(
        new Date(startDate),
        new Date(endDate),
      );
      return {
        message: 'Invoices retrieved successfully',
        data: invoices,
        count: invoices.length,
      };
    }

    // Sans filtre : toutes les invoices
    const invoices = await this.invoiceService.findAll();
    return {
      message: 'Invoices retrieved successfully',
      data: invoices,
      count: invoices.length,
    };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.invoiceService.getStats();
    return {
      message: 'Statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('stats/customer/:customerId')
  async getStatsByCustomer(@Param('customerId') customerId: string) {
    const stats = await this.invoiceService.getStatsByCustomer(customerId);
    return {
      message: 'Customer statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('stats/monthly/:year')
  async getMonthlyStats(@Param('year') year: string) {
    const stats = await this.invoiceService.getInvoicesByMonth(parseInt(year));
    return {
      message: 'Monthly statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('count')
  async count() {
    const count = await this.invoiceService.count();
    return {
      message: 'Count retrieved successfully',
      data: { count },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const invoice = await this.invoiceService.findOne(id);
    return {
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  // ==================== UPDATE ====================

  @Put()
  @ZodBody(updateInvoiceDto_1.UpdateInvoiceSchema)
  async update(@Body() updateInvoiceDto: updateInvoiceDto_1.UpdateInvoiceDto) {
    const invoice = await this.invoiceService.update(updateInvoiceDto);
    return {
      message: 'Invoice updated successfully',
      data: invoice,
    };
  }

  @Put(':id/partial')
  async updatePartial(
    @Param('id') id: string,
    @Body() partialData: Partial<updateInvoiceDto_1.UpdateInvoiceDto>,
  ) {
    const invoice = await this.invoiceService.updatePartial(id, partialData);
    return {
      message: 'Invoice updated successfully',
      data: invoice,
    };
  }

  // ==================== DELETE ====================

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const invoice = await this.invoiceService.remove(id);
    return {
      message: 'Invoice deleted successfully',
      data: invoice,
    };
  }

  @Delete('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  async removeByCustomer(@Param('customerId') customerId: string) {
    const result = await this.invoiceService.removeByCustomer(customerId);
    return {
      message: `${result.deletedCount} invoice(s) deleted successfully`,
      data: result,
    };
  }
}