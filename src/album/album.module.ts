import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistModule } from '../artist/artist.module';
import { albumProvider } from './album.provider';

@Module({
  imports: [
    ArtistModule, // Import ArtistModule to use its exported services
  ],
  controllers: [AlbumController],
  providers: [AlbumService, ...albumProvider],
  exports: [AlbumService],
})
export class AlbumModule {}
