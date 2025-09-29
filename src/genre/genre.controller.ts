import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { GenreService } from './genre.service';
import { ZodValidationPipe } from 'nestjs-zod';
import * as dto from './dto/createGenre.dto';
import { Genre } from './interface/genre.interface';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(dto.CreateGenreDtoSchema))
  async create (@Body() createGenreDto: dto.CreateGenreDto): Promise<Genre> {
    return await this.genreService.createGenre(createGenreDto);
  }

  @Get()
  async findAll(): Promise<Genre[]> {
    return await this.genreService.findAll();
  }
  @Get('sync')
  async synchronize(): Promise<void> {
    return this.genreService.sync();
  }

  @Get(':id')  // Route avec paramètre APRÈS
  async findOne(@Param('id') id: string): Promise<Genre | null> {
    return this.genreService.findGenreById(id);
  }
}
