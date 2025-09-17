import { ArgumentMetadata, Injectable, Logger, PipeTransform } from '@nestjs/common';
import * as zod from 'zod';


@Injectable()
export class ZodValidationPipePipe implements PipeTransform {

  constructor(private schema: zod.ZodSchema) {}

  logger = new Logger('ZodValidationPipePipe');
  transform(value: any, metadata: ArgumentMetadata) {
    try{
      const parsedValue = this.schema.parse(value);
      return parsedValue;

    }catch(error){
        console.log(error);
        this.logger.error('Validation failed:', error.errors);
    }
    return value;
  }
}
