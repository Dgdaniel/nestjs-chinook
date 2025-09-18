import { ZodValidationPipePipe } from './zod-validation-pipe.pipe';
import { z } from 'zod';

describe('ZodValidationPipePipe', () => {
  it('should be defined', () => {
    const schema = z.object({}); // Replace with your actual schema if needed
    expect(new ZodValidationPipePipe(schema)).toBeDefined();
  });
});
