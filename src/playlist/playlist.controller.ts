import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import * as dto from './dto/createPlaylist.dto';
import * as updateDto from './dto/updatePlaylist.dto';
import { Playlist as PlaylistPrisma } from '@prisma/client';
import { Playlist } from './interface/playlist.interface';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  logger = new Logger('PlaylistController');

  @Get('prisma')
  async findAllPrisma(): Promise<PlaylistPrisma[]> {
    try {
      return await this.playlistService.findAllPrisma();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to fetch playlists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('prisma')
  async createPrisma(
    @Body() createPlaylistDto: dto.CreatePlaylistDto,
  ): Promise<PlaylistPrisma> {
    try {
      return await this.playlistService.createPrisma(createPlaylistDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Failed to create playlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('prisma/:id')
  async updatePrisma(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaylistDto: dto.CreatePlaylistDto,
  ): Promise<PlaylistPrisma> {
    const result = await this.playlistService.updatePrisma(
      id,
      updatePlaylistDto,
    );
    if (!result) {
      throw new NotFoundException('Media type not found');
    }
    return result;
  }

  @Delete('prisma/:id')
  async deletePrisma(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message?: string }> {
    const result = await this.playlistService.deletePrisma(id);
    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to delete playlist',
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  // Routes MongoDB
  @Get()
  async findAll(): Promise<Playlist[]> {
    try {
      return await this.playlistService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch playlists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Playlist> {
    const result = await this.playlistService.findOne(id);
    if (!result) {
      throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post()
  async create(
    @Body() createPlaylistDto: dto.CreatePlaylistDto,
  ): Promise<Playlist> {
    try {
      return await this.playlistService.create(createPlaylistDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create playlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put()
  async update(
    @Body() updatePlaylistDto: updateDto.UpdatePlaylistDto,
  ): Promise<Playlist> {
    const result = await this.playlistService.update(updatePlaylistDto);
    if (!result) {
      throw new NotFoundException('Media type not found');
    }
    return result;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.playlistService.delete(id);
      return { success: true, message: 'Media type deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Route de synchronisation
  @Post('sync')
  async sync() {
    try {
      await this.playlistService.sync();
      return { success: true, message: 'Synchronization completed' };
    } catch (error) {
      throw new HttpException(
        'Failed to synchronize playlists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/tracks/add')
  async addTracks(
    @Param('id') playlistId: string,
    @Body('trackIds') trackIds: string[],
  ): Promise<Playlist> {
    return this.playlistService.addTracks(playlistId, trackIds);
  }

  @Put(':id/tracks/remove')
  async removeTracks(
    @Param('id') playlistId: string,
    @Body('trackIds') trackIds: string[],
  ): Promise<Playlist> {
    return this.playlistService.removeTracks(playlistId, trackIds);
  }
}
