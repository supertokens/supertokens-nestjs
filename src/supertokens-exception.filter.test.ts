import { vi, describe, it, beforeAll, expect, beforeEach } from 'vitest'
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import Session from 'supertokens-node/recipe/session'
import EmailPassword from 'supertokens-node/recipe/emailpassword'

import { SuperTokensModule } from './supertokens.module'
import { SuperTokensAuthGuard } from './supertokens-auth.guard'
import { SuperTokensExceptionFilter } from './supertokens-exception.filter'

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

const connectionUri = 'https://try.supertokens.io'

describe('SuperTokensExceptionFilter', () => {
  let app: INestApplication
  let exceptionFilter: SuperTokensExceptionFilter

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
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRoot({
          framework: 'express',
          supertokens: {
            connectionURI: connectionUri,
          },
          appInfo: AppInfo,
          recipeList: [Session.init(), EmailPassword.init()],
        }),
      ],
      controllers: [TestController],
    }).compile()

    app = moduleRef.createNestApplication()

    exceptionFilter = new SuperTokensExceptionFilter()
    app.useGlobalFilters(exceptionFilter)
    await app.init()
    // This is required so that the filtes get applied
    await app.listen(0)
  })

  it('should catch authentication errors', async () => {
    const spy = vi.spyOn(exceptionFilter, 'catch')
    await request(app.getHttpServer()).get(`/`)
    expect(spy).not.toHaveBeenCalled()
    await request(app.getHttpServer()).get(`/protected`)
    expect(spy).toHaveBeenCalled()
  })
})
