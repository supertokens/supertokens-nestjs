import { NestFactory } from '@nestjs/core';
import {
  getSuperTokensCORSHeaders,
  SuperTokensExceptionFilter,
} from 'supertokens-nestjs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
    snapshot: true,
  });
  app.enableCors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['content-type', ...getSuperTokensCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
