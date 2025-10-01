import { Module } from '@nestjs/common';
import { MediaTypeService } from './media-type.service';
import { MediaTypeController } from './media-type.controller';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../prisma/prisma.service';
import { mediaTypeProvider } from './media-type.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaTypeController],
  providers: [MediaTypeService, PrismaService, ...mediaTypeProvider],
})
export class MediaTypeModule {}
