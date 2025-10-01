import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { ALBUM_MODEL, ARTIST_MODEL } from 'src/constants/object.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album } from './interface/album.interface';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { Artist } from '@prisma/client';

@Injectable()
export class AlbumService {
    constructor(
        @Inject(ALBUM_MODEL) private readonly albumModel: Model<Album>,
        @Inject(ARTIST_MODEL) private readonly artistModel: Model<Artist>,
        private prisma: PrismaService
    ) { }

    logger = new Logger("AlbumService")

    async create(data: CreateAlbumDto): Promise<Album> {
        this.logger.log("data ", data)
        // First, check if artist exists
        const artist = await this.artistModel.findById(data.artistId).exec();

        if (!artist) {
            this.logger.error(`Artist with ID ${data.artistId} not found`)
            throw new NotFoundException(`Artist with ID ${data.artistId} not found`);
        }

        try {
            // Create and save the album first
            const newAlbum = new this.albumModel({
                title: data.title,
                artist: data.artistId
            });

            const savedAlbum = await newAlbum.save();

            // Populate the artist field after saving
            const populatedAlbum = await savedAlbum.populate('artist');

            // Update artist's albums array
            await this.artistModel.findByIdAndUpdate(
                data.artistId,
                { $push: { albums: savedAlbum._id } }
            );

            return populatedAlbum;
        } catch (error) {
            this.logger.error('Failed to create album:', error);
            throw new BadRequestException('Failed to create album: ' + error);
        }
    }

    async findAll(): Promise<Album[]> {
        try {
            const albums = await this.albumModel
                .find()
                .populate({
                    path: 'artist',
                    select: 'name createdAt' // Only select fields we need
                })
                .sort({ createdAt: -1 }) // Sort by newest first
                .exec();

            if (!albums.length) {
                this.logger.debug('No albums found');
                return [];
            }

            this.logger.debug(`Found ${albums.length} albums`);
            return albums;
        } catch (error) {
            this.logger.error('Failed to fetch albums:', error);
            throw new BadRequestException('Failed to fetch albums');
        }
    }

    async sync() {
        try {
            let allPrisma = await this.prisma.album.findMany({
                orderBy: {
                    title: 'asc'
                },
                include: {
                    artist: true
                }
            });

            let allArtistMongo = await this.artistModel.find().sort({ title: 1 }).exec();
            if (allArtistMongo.length === 0) {
                // Utiliser for...of au lieu de forEach pour pouvoir utiliser await
                for (const el of allArtistMongo) {
                    for (const da of allPrisma) {
                        if (el.toJSON().name === da.artist.name) {
                            this.logger.log("artist name ", da.artist.name);

                            let daniw: CreateAlbumDto = {
                                'artistId': el.id,
                                'title': da.title
                            };

                            await this.create(daniw);
                        }
                    }
                }
            }


        } catch (error) {
            this.logger.error('Error in sync method:', error);
            throw error;
        }
    }
}
