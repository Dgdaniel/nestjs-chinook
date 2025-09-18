import { Body, Controller, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ZodValidationException, ZodValidationPipe } from 'nestjs-zod';
import * as dto from './dto/createArtist.dto';
import * as updateArtistDto from './dto/updateArtist.dto';

@Controller('artist')
export class ArtistController {

    constructor(
        private readonly artistService: ArtistService
    ) { }

    @Get()
    async findAll() {
        return this.artistService.findAll();
    }

    @Post()
    @UsePipes(new ZodValidationPipe(dto.CreateArtistDtoSchema))
    async create(@Body() data: dto.CreateArtistDto) {
        return await this.artistService.create(data);
    }

    @Get('sync') 
    async synchronise() {
        return await this.artistService.sync();
    }

    @Get('prisma')
    async findAllPrisma() {
        return await this.artistService.findAllPrisma();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.artistService.findOne(id);
    }

    @Patch()
    @UsePipes(new ZodValidationPipe(updateArtistDto.UpdateArtistDtoSchema))
    async update(@Body() data: updateArtistDto.UpdateArtistDto) {
        return await this.artistService.update(data);
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
