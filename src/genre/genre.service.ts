import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GENRE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Genre } from './interface/genre.interface';
import { CreateGenreDto } from './dto/createGenre.dto';

@Injectable()
export class GenreService {
  private readonly logger = new Logger(GenreService.name);

  constructor(
    @Inject(GENRE_MODEL) private readonly genreModel: Model<Genre>,
    private prisma: PrismaService,
  ) {}

  async sync() {
    const allGenrePrisma = await this.prisma.genre.findMany();

    if (!allGenrePrisma.length) {
      this.logger.warn("No genres found in Prisma database");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    await Promise.all(
      allGenrePrisma.map(async (genre) => {
        try {
          await this.genreModel.create({
            name: genre.name,
          });
          successCount++;
        } catch (e) {
          errorCount++;
          this.logger.error(`Failed to sync genre "${genre.name}":`, e);
        }
      })
    );

    this.logger.log(
      `Sync finished: ${successCount} success, ${errorCount} errors`
    );
  }

  async createGenre(genre: CreateGenreDto): Promise<Genre> {
    return this.genreModel.create(genre);
  }

  async findGenreById(id: string): Promise<Genre | null> {
    return this.genreModel.findById(id).exec();
  }

  async findAll(): Promise<Genre[]> {
    this.logger.log("find all genres");
    return this.genreModel.find()
      .sort({
        createdAt: -1, // -1 correspond à desc
        updatedAt: -1,
        name: 'asc'
      })
      .exec();
  }
}