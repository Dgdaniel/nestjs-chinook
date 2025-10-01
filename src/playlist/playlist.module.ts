import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { playlistProvider } from './playlist.provider';
import { PrismaService } from '../prisma/prisma.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [
    PlaylistService,
    PrismaService,
    ...playlistProvider,
  ],
  controllers: [PlaylistController],
  imports: [DatabaseModule],
})
export class PlaylistModule { }
