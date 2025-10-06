import { UsePipes } from '@nestjs/common';
import * as zod from 'zod';
import { ZodValidationPipe } from 'nestjs-zod';

export const ZodBody = (schema: zod.ZodSchema) => {
 return UsePipes(new ZodValidationPipe(schema));
};
