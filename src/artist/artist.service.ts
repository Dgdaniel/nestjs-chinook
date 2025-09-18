import { Injectable, Inject } from '@nestjs/common';
import { ARTIST_MODEL } from 'src/constants/object.constants';
import { Artist } from './interfaces/artist.interface';
import { Model } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist as ArtistPrisma } from '@prisma/client';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';

@Injectable()
export class ArtistService {

    constructor(
        @Inject(ARTIST_MODEL) private readonly artistModel: Model<Artist>,
        private prisma: PrismaService
    ) {}

    async create(createArtistDto: CreateArtistDto): Promise<Artist> {
        const createdArtist = new this.artistModel(createArtistDto);
        return createdArtist.save();
    }

    async findAll(): Promise<Artist[]> {
        return  await this.artistModel.find().exec();
    }

    async  findOne(id: string): Promise<Artist | null> {
        return await this.artistModel.findById(id)
        .populate('albums') // Assuming 'albums' is the field in Artist schema that references Album documents
        .exec();
    }

    async update(updateArtistDto: UpdateArtistDto): Promise<Artist | null> {
        return await this.artistModel.findByIdAndUpdate(updateArtistDto.id, updateArtistDto, { new: true }).exec();
    }

    async findAllPrisma(): Promise<ArtistPrisma[] | []> {
        return await this.prisma.artist.findMany();
    }

    async findOnePrisma(id: number): Promise<ArtistPrisma | null> {
        return await this.prisma.artist.findUnique({
            where: { id }
        });
    }

    async createPrisma(data: CreateArtistDto): Promise<ArtistPrisma> {
        return await this.prisma.artist.create({
            data
        });
    }

    async deletePrisma(id: number): Promise<ArtistPrisma> {
        return await this.prisma.artist.delete({
            where: { id }
        });
    }
}
