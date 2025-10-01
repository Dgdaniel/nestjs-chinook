import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GENRE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { Genre } from './interface/genre.interface';
import * as dto  from './dto/createGenre.dto';
import * as updateDto  from './dto/updateGenre.dto';
import { Genre as GenrePrisma } from '@prisma/client';

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
      this.logger.warn('No genres found in Prisma database');
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
      }),
    );

    this.logger.log(
      `Sync finished: ${successCount} success, ${errorCount} errors`,
    );
  }

  async createGenre(genre: dto.CreateGenreDto): Promise<Genre> {
    return this.genreModel.create(genre);
  }

  async findGenreById(id: string): Promise<Genre | null> {
    return this.genreModel.findById(id).exec();
  }

  async findAll(): Promise<Genre[]> {
    this.logger.log('find all genres');
    return this.genreModel
      .find()
      .sort({
        createdAt: -1, // -1 correspond à desc
        updatedAt: -1,
        name: 'asc',
      })
      .exec();
  }

  async updateGenre(genre: updateDto.UpdateGenreDto): Promise<Genre | null> {
    return this.genreModel
      .findByIdAndUpdate({ _id: genre._id }, genre, { new: true })
      .exec();
  }

  async deleteGenre(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await this.genreModel.deleteOne({ _id: id }).exec();

      if (result.deletedCount === 0) {
        return {
          success: false,
          message: 'Genre not found',
        };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete genre with id ${id}:`, errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // prisma
  async createPrisma(genre: dto.CreateGenreDto): Promise<GenrePrisma> {
    return this.prisma.genre.create({
      data: {
        name: genre.name,
        id: undefined
      },
    });
  }

  async findAllPrisma(): Promise<GenrePrisma[]> {
    return this.prisma.genre.findMany();
  }

  async findOnePrisma(id: number): Promise<GenrePrisma | null> {
    return this.prisma.genre.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePrisma(id: number, genre: dto.CreateGenreDto): Promise<GenrePrisma> {
    return this.prisma.genre.update({
      where: {
        id,
      },
      data: genre,
    });
  }

  async deletePrisma(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.prisma.genre.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to delete genre with id ${id}:`, error);
      return {
        success: false,
        message: `Failed to delete genre with id ${id}`,
      };
    }
  }
}