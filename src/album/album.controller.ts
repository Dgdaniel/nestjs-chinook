import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AlbumService } from './album.service';
import * as dto from './dto/createAlbum.dto';
import { Album } from './interface/album.interface';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('album')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(dto.CreateAlbumDtoSchema))
    async create(@Body() createAlbumDto: dto.CreateAlbumDto): Promise<Album> {
        return await this.albumService.create(createAlbumDto);
    }

    @Get()
    async findAll(){
        return await this.albumService.findAll()
    }

    @Get('sync')
    async sync(){
        this.albumService.sync();
    }
}
