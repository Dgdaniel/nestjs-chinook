import { Inject, Injectable, Logger } from '@nestjs/common';
import { MEDIA_TYPE_MODEL } from '../constants/object.constants';
import { Model } from 'mongoose';
import { MediaType } from './interface/mediaType.interface';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType as MediaTypePrisma } from '@prisma/client';
import { UpdateMediaTypeDto } from './dto/updateMediaType.dto';
import { CreateMediaTypeDto } from './dto/createMediaType.dto';

@Injectable()
export class MediaTypeService {
  constructor(
    @Inject(MEDIA_TYPE_MODEL) private readonly mediaTypeModel: Model<MediaType>,
    private readonly prisma: PrismaService,
  ) {}
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
        } catch (e) {
          this.logger.error(e);
        }
      }
    } else {
      this.logger.log(
        `Media type ${allMediaTypes.length} not found or data already exists`,
      );
    }
  }

  async findAllPrisma(): Promise<MediaTypePrisma[]> {
    return this.prisma.mediaType.findMany();
  }

  async findAll(): Promise<MediaType[]> {
    return this.mediaTypeModel.find().exec();
  }

  async findOne(id: string): Promise<MediaType | null> {
    return this.mediaTypeModel.findById(id).exec();
  }

  async update(data: UpdateMediaTypeDto): Promise<MediaType | null> {
    return this.mediaTypeModel
      .findByIdAndUpdate({ _id: data.id }, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
     await this.mediaTypeModel.deleteOne({ _id: id }).exec();
  }

  async create(data: CreateMediaTypeDto): Promise<MediaType> {
    return this.mediaTypeModel.create(data);
  }

  async createPrisma(data: CreateMediaTypeDto): Promise<MediaTypePrisma> {
    return this.prisma.mediaType.create({
      data: data,
    })
  }
  async updatePrisma(id: number, data: CreateMediaTypeDto): Promise<MediaTypePrisma | null> {
    return this.prisma.mediaType.update({
      where: {
        id
      },
      data
    })
  }

  async deletePrisma(id: number): Promise<{success: boolean, message?: string}> {
    try {
      await this.prisma.mediaType.delete({ where: { id } });
      return { success: true, message: 'Media type deleted successfully' };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return { success: false, message: 'Media type not found' };
      }
      return { success: false, message: 'Failed to delete media type' };
    }
  }


}
