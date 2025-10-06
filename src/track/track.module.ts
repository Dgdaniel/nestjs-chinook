import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { trackProvider } from './track.provider';
import { albumProvider } from '../album/album.provider';
import { genreProvider } from '../genre/genre.provider';
import { mediaTypeProvider } from '../media-type/media-type.provider';

@Module({
  providers: [
    TrackService,
    ...trackProvider,
    ...albumProvider,
    ...genreProvider,
    ...mediaTypeProvider,
  ],
  controllers: [TrackController],
})
export class TrackModule {}
