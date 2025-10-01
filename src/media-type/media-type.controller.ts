import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { MediaTypeService } from './media-type.service';
import * as dto from './dto/createMediaType.dto';
import * as updateDto from './dto/updateMediaType.dto';

@Controller('media-type')
export class MediaTypeController {
  constructor(private readonly mediaTypeService: MediaTypeService) {}
  logger = new Logger('MediaTypeController');
  // Routes Prisma
  @Get('prisma')
  async findAllPrisma() {
    try {
      return await this.mediaTypeService.findAllPrisma();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to fetch media types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('prisma')
  async createPrisma(@Body() createMediaTypeDto: dto.CreateMediaTypeDto) {
    try {
      return await this.mediaTypeService.createPrisma(createMediaTypeDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to create media type',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('prisma/:id')
  async updatePrisma(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaTypeDto: dto.CreateMediaTypeDto,
  ) {
    try {
      const result = await this.mediaTypeService.updatePrisma(id, updateMediaTypeDto);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update media type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('prisma/:id')
  async deletePrisma(@Param('id', ParseIntPipe) id: number) {
    const result = await this.mediaTypeService.deletePrisma(id);
    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to delete media type',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  // Routes MongoDB
  @Get()
  async findAll() {
    try {
      return await this.mediaTypeService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch media types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.mediaTypeService.findOne(id);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch media type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createMediaTypeDto: dto.CreateMediaTypeDto) {
    try {
      return await this.mediaTypeService.create(createMediaTypeDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create media type',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put()
  async update(@Body() updateMediaTypeDto: updateDto.UpdateMediaTypeDto) {
    try {
      const result = await this.mediaTypeService.update(updateMediaTypeDto);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update media type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.mediaTypeService.delete(id);
      return { success: true, message: 'Media type deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete media type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Route de synchronisation
  @Post('sync')
  async sync() {
    try {
      await this.mediaTypeService.sync();
      return { success: true, message: 'Synchronization completed' };
    } catch (error) {
      throw new HttpException(
        'Failed to synchronize media types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}