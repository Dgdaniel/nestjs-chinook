import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { artistProvider } from './artist.provider';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ArtistController],
    providers: [
        ArtistService,
        PrismaService,
        ...artistProvider
    ],
     exports: [
        ArtistService,
        ...artistProvider
    ]
})
export class ArtistModule {
    
}
