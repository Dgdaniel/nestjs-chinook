import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from 'src/constants/object.constants';
import { Logger } from '@nestjs/common';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      const logger = new Logger('DatabaseProvider');

      try {
        const mongoUri = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
        logger.log(`Connecting to MongoDB: ${mongoUri}`);

        const connection = await mongoose.connect(mongoUri);
        logger.log('MongoDB connected successfully');

        return connection;
      } catch (error) {
        logger.error('MongoDB connection failed', error);
        throw error;
      }
    },
  },
];
