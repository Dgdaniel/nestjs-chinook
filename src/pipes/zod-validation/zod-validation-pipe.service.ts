import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import * as zod from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly schema?: zod.ZodSchema;
  private logger = new Logger('ZodValidationPipe');

  constructor(schema?: zod.ZodSchema) {
    this.schema = schema;
  }

  transform(value: any, _metadata: ArgumentMetadata) {
    if (!this.schema) {
      this.logger.warn('No schema provided, skipping validation');
      return value;
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
        code: issue.code,
      }));

      this.logger.error(
        'Validation failed:',
        JSON.stringify(formattedErrors, null, 2),
      );

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    this.logger.log('Validation successful');
    return result.data;
  }
}