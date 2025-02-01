import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import supertokens from 'supertokens-node'
import { SuperTokensExceptionFilter } from 'supertokens-nestjs'

import { appInfo } from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log(supertokens.getAllCORSHeaders())
  app.enableCors({
    origin: [appInfo.websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
  app.useGlobalFilters(new SuperTokensExceptionFilter())

  await app.listen(3001)
}
bootstrap()
