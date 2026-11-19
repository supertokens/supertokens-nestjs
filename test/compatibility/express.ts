import 'reflect-metadata'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ArgumentsHost,
  Catch,
  ExecutionContext,
  ExceptionFilter,
  Module,
} from '@nestjs/common'
import { APP_GUARD, NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  GqlExecutionContext,
  GraphQLModule,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import request from 'supertest'
import { Error as SuperTokensError } from 'supertokens-node'
import {
  PublicAccess,
  SuperTokensAuthGuard,
  SuperTokensExpressExceptionFilter,
  SuperTokensModule,
} from 'supertokens-nestjs'
import { SessionController, sessionOptions } from './shared'

@Resolver()
class SessionResolver {
  @PublicAccess()
  @Query(() => String)
  publicQuery() {
    return 'public data'
  }

  @Query(() => String)
  protectedQuery() {
    return 'protected data'
  }
}

@Catch(SuperTokensError)
class SessionExceptionFilter implements ExceptionFilter {
  private readonly expressFilter = new SuperTokensExpressExceptionFilter()

  catch(exception: InstanceType<typeof SuperTokensError>, host: ArgumentsHost) {
    if (host.getType<string>() !== 'graphql') {
      return this.expressFilter.catch(exception, host)
    }
    return new GraphQLError(exception.message, {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
}

function extractContext(context: ExecutionContext) {
  if (context.getType<string>() === 'graphql') {
    const { req, res } = GqlExecutionContext.create(context).getContext()
    return { request: req, response: res }
  }

  const http = context.switchToHttp()
  return { request: http.getRequest(), response: http.getResponse() }
}

@Module({
  imports: [
    SuperTokensModule.forRootAsync({
      useFactory: async () => ({ ...sessionOptions(), framework: 'express' }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
      driver: ApolloDriver,
    }),
  ],
  controllers: [SessionController],
  providers: [
    SessionResolver,
    {
      provide: APP_GUARD,
      useFactory: () => new SuperTokensAuthGuard(extractContext),
    },
  ],
})
class AppModule {}

test('Express and Apollo run with the packed SDK', async (t) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    abortOnError: false,
    logger: false,
  })
  t.after(() => app.close())
  app.useGlobalFilters(new SessionExceptionFilter())
  await app.init()
  const http = request(app.getHttpServer())

  await t.test('public, optional and protected HTTP routes', async () => {
    await http.get('/').expect(200, { outcome: 'public' })
    await http.get('/optional').expect(200, { outcome: 'no session' })
    await http.get('/protected').expect(401, { message: 'unauthorised' })
  })

  await t.test('SuperTokens middleware handles its own route', async () => {
    await http.post('/auth/signout').expect(401, { message: 'unauthorised' })
  })

  await t.test('GraphQL public data and auth errors', async () => {
    await http
      .post('/graphql')
      .send({ query: '{ publicQuery }' })
      .expect(200, { data: { publicQuery: 'public data' } })
    await http
      .post('/graphql')
      .send({ query: '{ protectedQuery }' })
      .expect(200)
      .expect(({ body }) => {
        assert.equal(body.data, null)
        assert.equal(body.errors[0].extensions.code, 'UNAUTHENTICATED')
        assert.match(body.errors[0].message, /Session does not exist/)
      })
  })
})
