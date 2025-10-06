import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { playlistProvider } from './playlist.provider';

@Module({
  providers: [PlaylistService, ...playlistProvider],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
