import { Module } from '@nestjs/common';
import { MediaTypeService } from './media-type.service';
import { MediaTypeController } from './media-type.controller';
import { mediaTypeProvider } from './media-type.provider';

@Module({
  controllers: [MediaTypeController],
  providers: [MediaTypeService, ...mediaTypeProvider],
  exports: [MediaTypeService],
})
export class MediaTypeModule {}
