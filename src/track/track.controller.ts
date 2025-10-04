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

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Post('synchronisation')
  async sync(): Promise<{ success: boolean; message?: string }> {
    return await this.trackService.sync();
  }

  @Get()
  async findALl(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param() id: string): Promise<Track | null> {
    return this.trackService.findOne(id);
  }

  @Put('prisma/:id')
  async updatePrisma(
    @Body() data: updateTrackPrismaDto.UpdateTrackPrismaDto,
  ): Promise<TrackPrisma> {
    return this.trackService.updatePrisma(data.id, data);
  }

  @Put(':id')
  async update(@Body() data: updateTrackDto.UpdateTrackDto): Promise<Track> {
    return this.trackService.update(data.id, data);
  }

  @Get('prisma/:id')
  async deletePrisma(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    return await this.trackService.deletePrisma(id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return this.trackService.delete(id);
  }

  @Post("prisma")
  @UsePipes(new ZodValidationPipe(createTrackPrismaDto.CreateTrackPrismaDtoSchema))
  async createPrisma(
    data: createTrackPrismaDto.CreateTrackPrismaDto,
  ): Promise<TrackPrisma> {
    return this.trackService.createPrisma(data);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTrackDto.CreateTrackDtoSchema))
  async create(data: createTrackDto.CreateTrackDto): Promise<Track> {
    return this.trackService.create(data);
  }
}
