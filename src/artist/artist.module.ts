import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { artistProvider } from './artist.provider';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ...artistProvider],
  exports: [ArtistService, ...artistProvider],
})
export class ArtistModule {}
