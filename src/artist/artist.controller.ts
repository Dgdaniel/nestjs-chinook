import { Controller, Get, Patch, UsePipes } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { UpdateArtistDto} from './dto/updateArtist.dto';
import { ZodValidationException, ZodValidationPipe } from 'nestjs-zod';

@Controller('artist')
export class ArtistController {

    constructor(
        private readonly artistService: ArtistService
    ) { }

    @Get()
    async findAll() {
        return this.artistService.findAll();
    }

    @Get('prisma')
    async findAllPrisma() {
        return await this.artistService.findAllPrisma();
    }

    async findOnePrisma(id: number) {
        return await this.artistService.findOnePrisma(id);
    }

    async createPrisma(data: any) {
        return await this.artistService.createPrisma(data);
    }

    async deletePrisma(id: number) {
        return await this.artistService.deletePrisma(id);
    }



}
