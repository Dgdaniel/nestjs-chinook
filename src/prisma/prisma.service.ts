import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new Logger('PrismaService');
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        this.logger.log('Prisma connected to the database successfully');
      })
      .catch((error) => {
        this.logger.error('Prisma connection error:', error);
      });
  }
}
