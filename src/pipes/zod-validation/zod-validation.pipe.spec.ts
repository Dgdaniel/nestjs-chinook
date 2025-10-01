import { ZodValidationPipe } from './zod-validation-pipe.service';
import { z } from 'zod';

describe('ZodValidationPipePipe', () => {
  it('should be defined', () => {
    const schema = z.object({}); // Replace with your actual schema if needed
    expect(new ZodValidationPipe(schema)).toBeDefined();
  });
});
