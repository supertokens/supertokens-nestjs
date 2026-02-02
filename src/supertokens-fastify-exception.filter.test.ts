import { vi, describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import Session from 'supertokens-node/recipe/session'
import EmailPassword from 'supertokens-node/recipe/emailpassword'

import { SuperTokensModule } from './supertokens.module'
import { SuperTokensAuthGuard } from './supertokens-auth.guard'
import { SuperTokensFastifyExceptionFilter } from './supertokens-fastify-exception.filter'

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

const connectionUri =
  process.env.VITE_ST_CONNECTION_URI || 'http://localhost:4356'

describe('SuperTokensExceptionFilter with Fastify', () => {
  let app: NestFastifyApplication

  beforeAll(async () => {
    @Controller()
    @UseGuards(SuperTokensAuthGuard)
    class TestController {
      @Get('/')
      getPublic(): string {
        return 'public'
      }

      @Get('/protected')
      getProtected(): string {
        return 'protected'
      }
    }
    const adapter = new FastifyAdapter()

    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRoot({
          framework: 'fastify',
          fastifyAdapter: adapter,
          supertokens: {
            connectionURI: connectionUri,
          },
          appInfo: AppInfo,
          recipeList: [Session.init(), EmailPassword.init()],
        }),
      ],
      controllers: [TestController],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(adapter)

    app.useGlobalFilters(new SuperTokensFastifyExceptionFilter())
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should catch authentication errors without crashing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/protected',
    })

    expect(response.statusCode).toBe(401)
  })
})
