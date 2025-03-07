import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import supertokens from 'supertokens-node'
import { SuperTokensExceptionFilter } from 'supertokens-nestjs'

import { appInfo, fastifyAdapter } from './config'
import { NestFastifyApplication } from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  )
  app.enableCors({
    origin: [appInfo.websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
  app.useGlobalFilters(new SuperTokensExceptionFilter())

  await app.listen(3001)
}
bootstrap()
