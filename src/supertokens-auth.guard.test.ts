import { vi, describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import Session from 'supertokens-node/recipe/session'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import { getSession } from 'supertokens-node/recipe/session'

import { SuperTokensModule } from './supertokens.module'
import { SuperTokensAuthGuard } from './supertokens-auth.guard'
import { SuperTokensExceptionFilter } from './supertokens-exception.filter'
import { APP_GUARD } from '@nestjs/core'
import { Auth, PublicAccess, VerifySession } from './decorators'

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

const connectionUri = 'https://try.supertokens.io'

vi.mock('supertokens-node/recipe/session', { spy: true })

describe('SuperTokensAuthGuard', () => {
  beforeAll(async () => {})

  it('should be called on a specific route', async () => {
    @Controller()
    class TestController {
      @Get('/')
      getPublic(): string {
        return 'public'
      }

      @Get('/protected')
      @UseGuards(SuperTokensAuthGuard)
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

    const app = moduleRef.createNestApplication()

    app.useGlobalFilters(new SuperTokensExceptionFilter())
    await app.init()
    // This is required so that the filtes get applied
    await app.listen(0)
    await request(app.getHttpServer()).get(`/`).expect(200)
    await request(app.getHttpServer()).get(`/protected`).expect(401)
    await app.close()
  })

  it('should be called on a specific controller', async () => {
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

    const app = moduleRef.createNestApplication()

    app.useGlobalFilters(new SuperTokensExceptionFilter())
    await app.init()
    // This is required so that the filtes get applied
    await app.listen(0)
    await request(app.getHttpServer()).get(`/`).expect(401)
    await request(app.getHttpServer()).get(`/protected`).expect(401)
    await app.close()
  })

  it('should be called globally', async () => {
    @Controller('/first')
    class FirstController {
      @Get('/')
      getPublic(): string {
        return 'protected'
      }
    }

    @Controller('/second')
    class SecondController {
      @Get('/')
      getPublic(): string {
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
      controllers: [FirstController, SecondController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: SuperTokensAuthGuard,
        },
      ],
    }).compile()

    const app = moduleRef.createNestApplication()

    app.useGlobalFilters(new SuperTokensExceptionFilter())
    await app.init()
    // This is required so that the filtes get applied
    await app.listen(0)
    await request(app.getHttpServer()).get(`/first/`).expect(401)
    await request(app.getHttpServer()).get(`/second/`).expect(401)
    await app.close()
  })

  describe('Decorators', async () => {
    let app: INestApplication
    let guard: SuperTokensAuthGuard

    beforeAll(async () => {
      @Controller()
      @UseGuards(SuperTokensAuthGuard)
      class TestController {
        @PublicAccess()
        @Get('/')
        getPublic() {}

        @Get('/protected')
        getProtected() {}

        @VerifySession({
          checkDatabase: true,
        })
        @Get('/verify-session')
        verifySession() {}

        @Auth({
          roles: ['admin'],
        })
        @Get('/roles')
        roles() {}

        @Auth({
          permissions: ['write'],
        })
        @Get('/permissions')
        permissions() {}

        @Auth({
          requireEmailVerification: true,
        })
        @Get('/require-email-verification')
        requireEmailVerification() {}

        @Auth({
          requireEmailVerification: false,
        })
        @Get('/disable-email-verification')
        disableEmailVerification() {}

        @Auth({
          requireMFA: true,
        })
        @Get('/require-mfa')
        requireMFA() {}

        @Auth({
          requireMFA: false,
        })
        @Get('/disable-mfa')
        disableMFA() {}
      }

      // spy = vi.spyOn(sessionRecipe, 'getSession')
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
      guard = moduleRef.get(SuperTokensAuthGuard)

      app.useGlobalFilters(new SuperTokensExceptionFilter())
      await app.init()
      // This is required so that the filtes get applied
      await app.listen(0)
    })

    afterAll(async () => {
      if (app) {
        await app.close()
      }
    })

    it('[PublicAccess] allows public access on a route', async () => {
      await request(app.getHttpServer()).get(`/`).expect(200)
      await request(app.getHttpServer()).get(`/protected`).expect(401)
    })

    it('[VerifySession] changes the get session options', async () => {
      getSession.mockClear()
      await request(app.getHttpServer()).get(`/protected`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , defaultVerifySessionOptions] = getSession.mock.lastCall
      expect(defaultVerifySessionOptions.checkDatabase).toBeUndefined()
      await request(app.getHttpServer()).get(`/verify-session`)
      expect(getSession).toHaveBeenCalledTimes(2)
      const [, , customVerifySessionOptions] = getSession.mock.lastCall
      expect(customVerifySessionOptions.checkDatabase).toBeTruthy()
    })
    it('[Auth] allows access on a route based on a role', async () => {
      getSession.mockClear()
      await request(app.getHttpServer()).get(`/roles`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , verifySessionOptions] = getSession.mock.lastCall
      const result = await verifySessionOptions.overrideGlobalClaimValidators(
        [],
      )
      console.log(result)
    })
    it.todo('[Auth] does not allow access on a route based on a role')
    it.todo('[Auth] allows access on a route based on a permission')
    it.todo('[Auth] does not allow access on a route based on a permission')
    it.todo('[Auth] allows access on a route based on both email verification')
    it.todo(
      '[Auth] does not allow access on a route based on email verification',
    )
    it.todo('[Auth] allows access on a route based on MFA')
    it.todo('[Auth] does not allow access on a route based on MFA')
  })
})
