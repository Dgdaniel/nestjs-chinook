import { Controller, Get } from '@nestjs/common';
import { MediaTypeService } from './media-type.service';

@Controller('media-type')
export class MediaTypeController {
  constructor(private mediaTypeService: MediaTypeService) {}

  @Get('sync')
  async syncAll(): Promise<void> {
    return await this.mediaTypeService.sync()
  }
}
