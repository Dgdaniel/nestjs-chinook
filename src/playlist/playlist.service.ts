import { Inject, Injectable, Logger } from '@nestjs/common';
import { PLAYLIST_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Playlist } from './interface/playlist.interface';
import { PrismaService } from '../prisma/prisma.service';
import * as dto from './dto/createPlaylist.dto';
import * as updateDto from './dto/updatePlaylist.dto'
import { Playlist as PlaylistPrisma } from '@prisma/client';
import { CreatePlaylistDto } from './dto/createPlaylist.dto';

@Injectable()
export class PlaylistService {
  constructor(@Inject(PLAYLIST_MODEL) private readonly playlistModel: Model<Playlist>,
              private prisma: PrismaService,) {
  }

  logger = new Logger('PlaylistService');

  async sync(): Promise<void> {
    let allPlaylists = await this.findAllPrisma();
    let allPlaylistMongo = await this.findAll();
    if (allPlaylistMongo.length === 0) {
      for (const playlist of allPlaylists) {
        try {
          await this.playlistModel.create({
            name: playlist.name,
          });
        } catch (e) {
          this.logger.error(e);
        }
      }
    } else {
      this.logger.log(
        `Playlist ${allPlaylists.length} not found or data already exists`,
      );
    }
  }

  async findAllPrisma(): Promise<PlaylistPrisma[]> {
    return this.prisma.playlist.findMany();
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistModel.find().exec();
  }

  async findOne(id: string): Promise<Playlist | null> {
    return this.playlistModel.findById(id).exec();
  }

  async update(data: updateDto.UpdatePlaylistDto): Promise<Playlist | null> {
    return this.playlistModel
      .findByIdAndUpdate(
        { _id: data.id },
        { ...data, $inc: { __v: 1 } },
        { new: true }
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.playlistModel.deleteOne({ _id: id }).exec();
  }

  async create(data: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistModel.create(data);
  }

  async createPrisma(data: CreatePlaylistDto): Promise<PlaylistPrisma> {
    return this.prisma.playlist.create({
      data: data,
    })
  }
  async updatePrisma(id: number, data: dto.CreatePlaylistDto): Promise<PlaylistPrisma | null> {
    return this.prisma.playlist.update({
      where: {
        id
      },
      data
    })
  }

  async deletePrisma(id: number): Promise<{success: boolean, message?: string}> {
    try {
      await this.prisma.playlist.delete({ where: { id } });
      return { success: true, message: 'Playlist deleted successfully' };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return { success: false, message: 'Playlist not found' };
      }
      return { success: false, message: 'Failed to delete media type' };
    }
  }


}
