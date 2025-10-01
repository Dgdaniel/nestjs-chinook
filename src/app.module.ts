import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './prisma/prisma.service';
import { AlbumModule } from './album/album.module';
import { GenreModule } from './genre/genre.module';
import { MediaTypeModule } from './media-type/media-type.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
       ArtistModule,
       DatabaseModule,
       AlbumModule,
       GenreModule,
       MediaTypeModule,
       PlaylistModule
      ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
