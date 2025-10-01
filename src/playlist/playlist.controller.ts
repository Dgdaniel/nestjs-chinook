import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import * as dto from './dto/createPlaylist.dto';
import * as updateDto from './dto/updatePlaylist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  logger = new Logger('PlaylistController');

  @Get('prisma')
  async findAllPrisma() {
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
  async createPrisma(@Body() createPlaylistDto: dto.CreatePlaylistDto) {
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
  ) {
    try {
      const result = await this.playlistService.updatePrisma(id, updatePlaylistDto);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('prisma/:id')
  async deletePrisma(@Param('id', ParseIntPipe) id: number) {
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
  async findAll() {
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
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.playlistService.findOne(id);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createPlaylistDto: dto.CreatePlaylistDto) {
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
  async update(@Body() updatePlaylistDto: updateDto.UpdatePlaylistDto) {
    try {
      const result = await this.playlistService.update(updatePlaylistDto);
      if (!result) {
        throw new HttpException('Media type not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to update playlist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
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
}
