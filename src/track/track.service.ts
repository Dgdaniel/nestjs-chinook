import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ALBUM_MODEL, GENRE_MODEL, MEDIA_TYPE_MODEL, TRACK_MODEL, } from '../constants/object.constants';
import { Track } from './interface/track.interface';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Genre } from '../genre/interface/genre.interface';
import { Album } from '../album/interface/album.interface';
import { MediaType } from '../media-type/interface/mediaType.interface';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import { UpdateTrackPrismaDto } from './dto/updateTrackPrisma.dto';
import { Track as TrackPrisma } from '@prisma/client';
import { CreateTrackPrismaDto } from './dto/createTrackPrisma.dto';

@Injectable()
export class TrackService {
  constructor(
    @Inject(TRACK_MODEL) private readonly trackModel: Model<Track>,
    @Inject(GENRE_MODEL) private readonly genreModel: Model<Genre>,
    @Inject(ALBUM_MODEL) private readonly albumModel: Model<Album>,
    @Inject(MEDIA_TYPE_MODEL) private readonly mediaModel: Model<MediaType>,
    private prisma: PrismaService,
  ) {}

  logger = new Logger('TrackService');
  async sync(): Promise<{ success: boolean; message?: string }> {
    try {
      // 1. Récupérer tous les tracks de Prisma
      const allTracks = await this.prisma.track.findMany({
        include: {
          genre: true,
          album: true,
          mediaType: true,
        },
      });

      // 2. Vérifier les tracks existants dans MongoDB
      const allTracksMongo = await this.trackModel.find().exec();

      if (allTracksMongo.length > 0) {
        return {
          success: false,
          message: 'Tracks already synchronized in MongoDB',
        };
      }

      if (allTracks.length === 0) {
        return {
          success: false,
          message: 'No tracks found in Prisma database',
        };
      }

      this.logger.log(`Starting sync of ${allTracks.length} tracks`);

      let successCount = 0;
      let errorCount = 0;

      // 3. Boucler sur tous les tracks
      for (const track of allTracks) {
        try {
          // Vérifier le genre
          const genreFound = await this.genreModel
            .findOne({
              name: track.genre?.name, // Utiliser Mongoose query, pas "where"
            })
            .exec();

          if (!genreFound) {
            this.logger.error(`No genre found with name: ${track.genre?.name}`);
            errorCount++;
            continue;
          }

          // Vérifier l'album
          const albumFound = await this.albumModel
            .findOne({
              title: track.album?.title,
            })
            .exec();

          if (!albumFound) {
            this.logger.error(
              `No album found with title: ${track.album?.title}`,
            );
            errorCount++;
            continue;
          }

          // Vérifier le mediaType (ATTENTION: await manquait ici!)
          const mediaFound = await this.mediaModel
            .findOne({
              name: track.mediaType?.name,
            })
            .exec();

          if (!mediaFound) {
            this.logger.error(
              `No media type found with name: ${track.mediaType?.name}`,
            );
            errorCount++;
            continue;
          }

          // Créer le track dans MongoDB
          const created = await this.trackModel.create({
            name: track.name,
            composer: track.composer,
            milliseconds: track.milliseconds,
            bytes: track.bytes,
            unitPrice: track.unitPrice,
            // Référencer les IDs MongoDB, pas les objets entiers
            genre: genreFound._id,
            album: albumFound._id,
            mediaType: mediaFound._id,
          });

          this.logger.log(`Track created: ${created.name}`);
          successCount++;
        } catch (error) {
          this.logger.error(`Error creating track ${track.name}:`, error);
          errorCount++;
        }
      }

      return {
        success: true,
        message: `Synchronization completed: ${successCount} tracks created, ${errorCount} errors`,
      };
    } catch (error) {
      this.logger.error('Sync failed:', error);
      return {
        success: false,
        message: `Synchronization failed: ${error}`,
      };
    }
  }

  async findAll(): Promise<Track[]> {
    return this.trackModel
      .find()
      .populate('genre')
      .populate('album')
      .populate('mediaType')
      .exec();
  }

  async findAllPrisma(): Promise<TrackPrisma[]> {
    return this.prisma.track.findMany({
      include: {
        genre: true,
        album: true,
        mediaType: true,
      }
    });

  }

  async findOne(id: string): Promise<Track | null> {
    return this.trackModel
      .findById(id)
      .populate(['genre', 'album', 'mediaType'])
      .exec();
  }
  async findOnePrisma(id: number): Promise<TrackPrisma | null> {
    return this.prisma.track.findUnique({
      where: {
        id
      },
      include: {
        genre: true,
        album: true,
        mediaType: true,
      },
    });
  }

  async create(track: CreateTrackDto): Promise<Track> {
    const newTrack = new this.trackModel({
      name: track.name,
      composer: track.composer,
      milliseconds: track.milliseconds,
      bytes: track.bytes,
      unitPrice: track.unitPrice,
      mediaType: track.mediaTypeId,
      genre: track.genreId,
      album: track.albumId,
    });

    await newTrack.save();

    return newTrack.populate(['genre', 'album', 'mediaType']);
  }

  async createPrisma(track: CreateTrackPrismaDto): Promise<TrackPrisma> {
    return this.prisma.track.create({
      data: track,
      include: {
        genre: true,
        album: true,
        mediaType: true,
      }
    })
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    const updated = await this.trackModel
      .findByIdAndUpdate(
        id, // Pas besoin de { id: ... }, juste l'ID directement
        {
          name: data.name,
          composer: data.composer,
          milliseconds: data.milliseconds,
          bytes: data.bytes,
          unitPrice: data.unitPrice,
          genre: data.genreId,
          album: data.albumId,
          mediaType: data.mediaTypeId,
        },
        { new: true }, // Retourne le document mis à jour
      )
      .populate('genre')
      .populate('album')
      .populate('mediaType')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return updated;
  }

  async updatePrisma(id: number, data: UpdateTrackPrismaDto): Promise<TrackPrisma> {
    try {


      return await this.prisma.track.update({
        where: {
          id: id, // Utiliser le paramètre 'id', pas 'data.id'
        },
        data: {
          name: data.name,
          albumId: data.albumId,
          mediaTypeId: data.mediaTypeId,
          genreId: data.genreId,
          composer: data.composer,
          milliseconds: data.milliseconds,
          bytes: data.bytes,
          unitPrice: data.unitPrice,
        },
        include: {
          genre: true,
          album: true,
          mediaType: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      throw new Error(`Failed to update track: ${error.message}`);
    }
  }

  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    const deleted = await this.trackModel.deleteOne({ _id: id }).exec();

    if (deleted.deletedCount === 0) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return {
      success: true,
      message: `Track with ID ${id} deleted successfully`,
    };
  }

  async deletePrisma(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });

      return {
        success: true,
        message: `Track with ID ${id} deleted successfully`,
      };
    } catch (error : any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      throw new Error(`Failed to delete track: ${error?.message}`);
    }
  }
}
