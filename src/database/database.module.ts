import { Global, Module } from '@nestjs/common';
import { databaseProviders } from 'src/database/databse.provider';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
