import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArtistModule } from '../artist/artist.module';
import { albumProvider } from './album.provider';

@Module({
    imports: [
        DatabaseModule,
        ArtistModule    // Import ArtistModule to use its exported services
    ],
    controllers: [AlbumController],
    providers: [
        AlbumService,
        PrismaService,
        ...albumProvider
    ],
    exports: [AlbumService]
})
export class AlbumModule {}
