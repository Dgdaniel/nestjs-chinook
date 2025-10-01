import { Inject, Injectable, Logger } from '@nestjs/common';
import { MEDIA_TYPE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { MediaType } from './interface/mediaType.interface';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType as MediaTypePrisma } from '@prisma/client'


@Injectable()
export class MediaTypeService {
  constructor(@Inject(MEDIA_TYPE_MODEL) private readonly mediaTypeModel: Model<MediaType>,
              private readonly prisma: PrismaService,) {
  }
  logger = new Logger('MediaTypeService');

  async sync(): Promise<void> {
    let allMediaTypes = await this.findAllPrisma();
    let allMediaTypeMongo = await this.findAll();
    if (allMediaTypeMongo.length === 0) {

      for (const mediaType of allMediaTypes) {
        this.logger.log(mediaType);
        try {
          await this.mediaTypeModel.create({
             name: mediaType.name,
          });
        }catch (e) {
          this.logger.error(e);
        }

      }
    }else{
      this.logger.log(`Media type ${allMediaTypes.length} not found or data already exists`);
    }

  }

  async findAllPrisma(): Promise<MediaTypePrisma[]> {
    return this.prisma.mediaType.findMany();
  }

  async findAll(): Promise<MediaType[]> {
    return this.mediaTypeModel.find().exec();
  }

  async findOne(id: string): Promise<MediaType> {
    return this.mediaTypeModel.findById(id).exec();
  }

  async update(data: UpdateMediaTypeDto): Promise<MediaType> {

  }
}
