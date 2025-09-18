import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './prisma/prisma.service';
import { AlbumModule } from './album/album.module';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
       ArtistModule,
       DatabaseModule,
       AlbumModule
      ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
