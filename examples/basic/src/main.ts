import { NestFactory } from '@nestjs/core';
import {
  getSuperTokensCORSHeaders,
  SuperTokensExceptionFilter,
} from 'supertokens/nestjs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  app.enableCors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['content-type', ...getSuperTokensCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  const server = app.getHttpServer();

  console.log(server._events.request);
  const router = server._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  console.log(availableRoutes);
}
bootstrap();
