import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { TrackModule } from './track/track.module';
import { EmployeeModule } from './employee/employee.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { InvoiceController } from './invoice/invoice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ArtistModule,
    DatabaseModule,
    AlbumModule,
    GenreModule,
    MediaTypeModule,
    PlaylistModule,
    TrackModule,
    EmployeeModule,
    PrismaModule,
    CustomerModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(InvoiceController)
  }
}
