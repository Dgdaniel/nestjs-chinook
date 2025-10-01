import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { PrismaService } from '../prisma/prisma.service';
import { trackProvider } from './track.provider';
import { DatabaseModule } from '../database/database.module';
import { albumProvider } from '../album/album.provider';
import { genreProvider } from '../genre/genre.provider';
import { mediaTypeProvider } from '../media-type/media-type.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    TrackService,
    PrismaService,
    ...trackProvider,
    ...albumProvider,
    ...genreProvider,
    ...mediaTypeProvider,
  ],
  controllers: [TrackController],
})
export class TrackModule {}
