import {
  vi,
  describe,
  it,
  beforeAll,
  expect,
  afterAll,
  beforeEach,
  Mock,
} from 'vitest'
import {
  ArgumentsHost,
  Catch,
  Controller,
  ExceptionFilter,
  ExecutionContext,
  Get,
  INestApplication,
  UseGuards,
} from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import Session from 'supertokens-node/recipe/session'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import UserRoles from 'supertokens-node/recipe/userroles'
import { EmailVerificationClaim } from 'supertokens-node/recipe/emailverification'
import { MultiFactorAuthClaim } from 'supertokens-node/recipe/multifactorauth'
import {
  Resolver,
  Query,
  GqlExecutionContext,
  GraphQLModule,
  GqlArgumentsHost,
} from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Error as STError } from 'supertokens-node'
import { GraphQLError } from 'graphql'

import { SuperTokensModule } from './supertokens.module'
import { SuperTokensAuthGuard } from './supertokens-auth.guard'
import { SuperTokensExceptionFilter } from './supertokens-exception.filter'
import { APP_GUARD } from '@nestjs/core'
import {
  Session as SessionParamDecorator,
  PublicAccess,
  VerifySession,
} from './decorators'
import { errorHandler } from 'supertokens-node/framework/fastify'

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

// @ts-expect-error
const connectionUri = import.meta.env.VITE_ST_CONNECTION_URI

const getSession = Session.getSession as Mock<typeof getSession>
vi.mock('supertokens-node/recipe/session', { spy: true })

describe('SuperTokensAuthGuard', () => {
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
    // This is required so that the filters get applied
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
    let checkSessionDecoratorFn = vi.fn()

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
          options: {
            checkDatabase: true,
          },
        })
        @Get('/verify-session')
        verifySession() {}

        @VerifySession({
          roles: ['admin'],
        })
        @Get('/roles')
        roles() {}

        @VerifySession({
          permissions: ['write'],
        })
        @Get('/permissions')
        permissions() {}

        @VerifySession({
          requireEmailVerification: true,
        })
        @Get('/require-email-verification')
        requireEmailVerification() {}

        @VerifySession({
          options: {
            overrideGlobalClaimValidators: (globalValidators) => [
              ...globalValidators,
              EmailVerificationClaim.validators.isVerified(),
            ],
          },
          requireEmailVerification: false,
        })
        @Get('/disable-email-verification')
        disableEmailVerification() {}

        @VerifySession({
          requireMFA: true,
        })
        @Get('/require-mfa')
        requireMFA() {}

        @VerifySession({
          requireMFA: false,
        })
        @Get('/disable-mfa')
        disableMFA() {}

        @Get('/session-params')
        sessionParams(
          @SessionParamDecorator() session,
          @SessionParamDecorator('userId') userId,
        ) {
          checkSessionDecoratorFn(session, userId)
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

    beforeEach(async () => {
      getSession.mockClear()
    })

    it('PublicAccess', async () => {
      await request(app.getHttpServer()).get(`/`).expect(200)
      await request(app.getHttpServer()).get(`/protected`).expect(401)
    })

    it('VerifySession', async () => {
      await request(app.getHttpServer()).get(`/protected`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , defaultVerifySessionOptions] = getSession.mock.lastCall
      expect(defaultVerifySessionOptions.checkDatabase).toBeUndefined()
      await request(app.getHttpServer()).get(`/verify-session`)
      expect(getSession).toHaveBeenCalledTimes(2)
      const [, , customVerifySessionOptions] = getSession.mock.lastCall
      expect(customVerifySessionOptions.checkDatabase).toBeTruthy()
    })
    it('Auth[roles]', async () => {
      await request(app.getHttpServer()).get(`/roles`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , verifySessionOptions] = getSession.mock.lastCall
      const actualValidators =
        await verifySessionOptions.overrideGlobalClaimValidators([])
      const expectedValidators = [
        UserRoles.UserRoleClaim.validators.includesAll(['admin']),
      ]
      for (const [index, validator] of actualValidators.entries()) {
        expect(validator.id).toBe(expectedValidators[index].id)
      }
    })
    it('Auth[permissions]', async () => {
      await request(app.getHttpServer()).get(`/permissions`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , verifySessionOptions] = getSession.mock.lastCall
      const actualValidators =
        await verifySessionOptions.overrideGlobalClaimValidators([])
      const expectedValidators = [
        UserRoles.PermissionClaim.validators.includesAll(['write']),
      ]
      for (const [index, validator] of actualValidators.entries()) {
        expect(validator.id).toBe(expectedValidators[index].id)
      }
    })
    it('Auth[requireEmailVerification]', async () => {
      await request(app.getHttpServer()).get(`/require-email-verification`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , requireEvVerifySessionOptions] = getSession.mock.lastCall
      const actualValidators =
        await requireEvVerifySessionOptions.overrideGlobalClaimValidators([])
      const expectedValidators = [
        EmailVerificationClaim.validators.isVerified(),
      ]
      for (const [index, validator] of actualValidators.entries()) {
        expect(validator.id).toBe(expectedValidators[index].id)
      }
      await request(app.getHttpServer()).get(`/disable-email-verification`)
      expect(getSession).toHaveBeenCalledTimes(2)
      const [, , disableEvVerifySessionOptions] = getSession.mock.lastCall
      const disableEvValidators =
        await disableEvVerifySessionOptions.overrideGlobalClaimValidators([])
      expect(disableEvValidators).toEqual([])
    })
    it('Auth[requireMFA]', async () => {
      await request(app.getHttpServer()).get(`/require-mfa`)
      expect(getSession).toHaveBeenCalledTimes(1)
      const [, , verifySessionOptions] = getSession.mock.lastCall
      const actualValidators =
        await verifySessionOptions.overrideGlobalClaimValidators([])
      const expectedValidators = [
        MultiFactorAuthClaim.validators.hasCompletedMFARequirementsForAuth(),
      ]
      for (const [index, validator] of actualValidators.entries()) {
        expect(validator.id).toBe(expectedValidators[index].id)
      }
    })
    it('Session', async () => {
      const userId = 'userId'
      const mockSession = {
        getUserId: () => userId,
      }
      getSession.mockImplementationOnce(() => mockSession)
      await request(app.getHttpServer()).get(`/session-params`)
      expect(getSession).toHaveBeenCalledTimes(1)
      expect(checkSessionDecoratorFn).toHaveBeenCalledWith(mockSession, userId)
    })
  })

  it('should work with graphql', async () => {
    @Resolver()
    class TestResolver {
      @Query(() => String)
      protectedQuery(): string {
        return 'protected data'
      }

      @PublicAccess()
      @Query(() => String)
      publicQuery(): string {
        return 'public data'
      }
    }

    @Catch(STError)
    class GQLExceptionFilter implements ExceptionFilter {
      handler: ReturnType<typeof errorHandler>

      constructor() {
        this.handler = errorHandler()
      }

      catch(exception: Error, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host)
        const ctx = gqlHost.getContext()

        return new GraphQLError(exception.message, {
          extensions: {
            code: 401,
            statusCode: 401,
          },
        })
      }
    }

    function contextDataExtractor(ctx: ExecutionContext) {
      const gqlContext = GqlExecutionContext.create(ctx)
      const contextObject = gqlContext.getContext()
      return {
        request: contextObject.req,
        response: contextObject.res,
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
          autoSchemaFile: true,
          context: ({ req, res }) => {
            return { req, res }
          },
          driver: ApolloDriver,
        }),
      ],
      providers: [
        TestResolver,
        {
          provide: APP_GUARD,
          useFactory: () => {
            return new SuperTokensAuthGuard(contextDataExtractor)
          },
        },
      ],
    }).compile()

    const app = moduleRef.createNestApplication()

    app.useGlobalFilters(new GQLExceptionFilter())
    await app.init()

    // This is required so that the filtes get applied
    await app.listen(0)

    const protectedQuery = `
      query {
        protectedQuery
      }
    `
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: protectedQuery })
      .expect((res) => {
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

    const publicQuery = `
      query {
        publicQuery
      }
    `
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: publicQuery })
      .expect((res) => {
        expect(res.body.errors).toBeUndefined()
      })

    expect(response.body.data.publicQuery).toBe('public data')

    await app.close()
  })
})
