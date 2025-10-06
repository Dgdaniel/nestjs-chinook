import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { genreProvider } from './genre.provider';

@Module({
  controllers: [GenreController],
  providers: [GenreService, ...genreProvider],
  exports: [GenreService],
})
export class GenreModule {}
