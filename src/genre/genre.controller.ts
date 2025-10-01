import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, } from '@nestjs/common';
import { GenreService } from './genre.service';
import { ZodValidationPipe } from 'nestjs-zod';
import * as dto from './dto/createGenre.dto';
import type { Genre } from './interface/genre.interface';
import * as updateGenreDto from './dto/updateGenre.dto';
import type { Genre as GenrePrisma } from '@prisma/client';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  //  ROUTES GÉNÉRALES (sans paramètre)

  @Post()
  @UsePipes(new ZodValidationPipe(dto.CreateGenreDtoSchema))
  async create(@Body() createGenreDto: dto.CreateGenreDto): Promise<Genre> {
    return this.genreService.createGenre(createGenreDto);
  }

  @Get()
  async findAll(): Promise<Genre[]> {
    return this.genreService.findAll();
  }

  // ROUTES SPÉCIFIQUES (avant les routes avec :id)

  @Get('sync')
  async synchronize(): Promise<void> {
    return this.genreService.sync();
  }

  //  ROUTES PRISMA SPÉCIFIQUES

  @Post('prisma')
  @UsePipes(new ZodValidationPipe(dto.CreateGenreDtoSchema))
  async createGenrePrisma(
    @Body() createGenreDto: dto.CreateGenreDto,
  ): Promise<GenrePrisma> {
    return this.genreService.createPrisma(createGenreDto);
  }

  @Get('prisma')
  async findAllPrisma(): Promise<GenrePrisma[]> {
    return this.genreService.findAllPrisma();
  }

  @Get('prisma/:id')
  async findOnePrismaById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenrePrisma | null> {
    return this.genreService.findOnePrisma(id);
  }

  @Patch('prisma/:id')
  async updatePrisma(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: dto.CreateGenreDto,
  ): Promise<GenrePrisma> {
    return this.genreService.updatePrisma(id, updateGenreDto);
  }

  @Delete('prisma/:id')
  async deletePrisma(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message?: string }> {
    return this.genreService.deletePrisma(id);
  }

  // ROUTES MONGODB AVEC :id (EN DERNIER)

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre | null> {
    return this.genreService.findGenreById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: updateGenreDto.UpdateGenreDto,
  ): Promise<Genre | null> {
    return this.genreService.updateGenre(dto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return this.genreService.deleteGenre(id);
  }
}
