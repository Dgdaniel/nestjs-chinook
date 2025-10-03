import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ALBUM_MODEL,
  GENRE_MODEL,
  MEDIA_TYPE_MODEL,
  TRACK_MODEL,
} from '../constants/object.constants';
import { Track } from './interface/track.interface';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { Genre } from '../genre/interface/genre.interface';
import { Album } from '../album/interface/album.interface';
import { MediaType } from '../media-type/interface/mediaType.interface';

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
    let allTracks = await this.prisma.track.findMany({
      include: {
        genre: true,
        album: true,
        mediaType: true,
      },
    });

    let alltrackMongo = await this.trackModel.find();
    if (alltrackMongo.length === 0) {
      this.logger.error('No track found');
      for (const track of allTracks) {
        let genreFound = await this.genreModel.findOne({
          where: {
            name: track.genre!.name,
          },
        });

        if (!genreFound) {
          this.logger.error(`No genre found with name: ${track.genre!.name}`);
          continue;
        }

        let albumFound = await this.albumModel.findOne({
          where: {
            title: track.album!.title,
          },
        });
        if (!albumFound) {
          this.logger.error(`No album found with title ${track.album!.title}`);
          continue;
        }

        let mediaFound = this.mediaModel.findOne({
          where: {
            name: track.mediaType!.name,
          },
        });
        if (!mediaFound) {
          this.logger.error(
            `No media type found with name ${track!.mediaType!.name}`,
          );
        }
        let created = await this.trackModel.create({
          ...track,
          genre: genreFound,
          mediaType: mediaFound,
          album: albumFound,
        });
        this.logger.log({ created });
        return {
          success: true,
          message: '',
        };
      }
      return Promise.resolve({
        success: true,
        message: 'Synchronisation done Successfully',
      });
    } else {
      return Promise.resolve({
        success: false,
        message: 'No track found or something went wrong',
      });
    }
  }
}
