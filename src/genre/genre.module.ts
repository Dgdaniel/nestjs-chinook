import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { PrismaService } from '../prisma/prisma.service';
import { genreProvider } from './genre.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[
    DatabaseModule,
  ],
  controllers: [GenreController],
  providers: [
    GenreService,
    PrismaService,
    ...genreProvider
  ],
  exports: [GenreService]
})
export class GenreModule {}
