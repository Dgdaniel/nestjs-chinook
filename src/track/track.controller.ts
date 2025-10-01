import { Controller, Post } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Post("synchronisation")
  async sync(): Promise<{success: boolean, message?: string}> {
    return await this.trackService.sync();
  }
}
