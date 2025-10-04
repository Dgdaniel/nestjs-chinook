import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './interface/track.interface';
import * as updateTrackDto from './dto/updateTrack.dto';
import * as createTrackDto from './dto/createTrack.dto';
import { Track as TrackPrisma } from '@prisma/client';
import * as updateTrackPrismaDto from './dto/updateTrackPrisma.dto';
import { ZodValidationPipe } from '../pipes/zod-validation/zod-validation-pipe.service';
import * as createTrackPrismaDto from './dto/createTrackPrisma.dto';
import { ZodBody } from '../decorators/zod-body/zod-body.decorator';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post('synchronisation')
  async sync(): Promise<{ success: boolean; message?: string }> {
    return await this.trackService.sync();
  }

  @Get('prisma')
  async findAllPrisma(): Promise<TrackPrisma[]> {
    return await this.trackService.findAllPrisma();
  }

  @Post('prisma')
  @UsePipes(new ZodValidationPipe(createTrackPrismaDto.CreateTrackPrismaDtoSchema))
  async createPrisma(
    @Body() data: createTrackPrismaDto.CreateTrackPrismaDto,
  ): Promise<TrackPrisma> {
    return this.trackService.createPrisma(data);
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Post()
  @ZodBody(createTrackDto.CreateTrackDtoSchema)
  async create(@Body() data: createTrackDto.CreateTrackDto): Promise<Track> {
    return this.trackService.create(data);
  }

  @Get('prisma/:id')
  async findOnePrisma(@Param('id') id: number): Promise<TrackPrisma | null> {
    return await this.trackService.findOnePrisma(+id);
  }

  @Put('prisma/:id')
  async updatePrisma(
    @Param('id') id: string,
    @Body() data: updateTrackPrismaDto.UpdateTrackPrismaDto,
  ): Promise<TrackPrisma> {
    return this.trackService.updatePrisma(+id, data);
  }

  @Delete('prisma/:id')
  async deletePrisma(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return await this.trackService.deletePrisma(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Track | null> {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: updateTrackDto.UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return this.trackService.delete(id);
  }
}