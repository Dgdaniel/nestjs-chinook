import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe())
  // use global middleware like this
  // app.use(LoggingMiddleware)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
