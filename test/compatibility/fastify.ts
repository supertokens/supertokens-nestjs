import 'reflect-metadata'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Module } from '@nestjs/common'
import { APP_GUARD, NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import {
  SuperTokensAuthGuard,
  SuperTokensFastifyExceptionFilter,
  SuperTokensModule,
  type SuperTokensModuleOptions,
} from 'supertokens-nestjs'
import { SessionController, sessionOptions } from './shared'

const adapter = new FastifyAdapter()

@Module({
  imports: [
    SuperTokensModule.forRootAsync({
      useFactory: (): SuperTokensModuleOptions => ({
        ...sessionOptions(),
        framework: 'fastify',
        fastifyAdapter: adapter,
      }),
    }),
  ],
  controllers: [SessionController],
  providers: [{ provide: APP_GUARD, useClass: SuperTokensAuthGuard }],
})
class AppModule {}

test('Fastify runs with the packed SDK', async (t) => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { abortOnError: false, logger: false },
  )
  t.after(() => app.close())
  app.useGlobalFilters(new SuperTokensFastifyExceptionFilter())
  await app.init()
  await adapter.getInstance().ready()

  await t.test('public, optional and protected HTTP routes', async () => {
    const open = await app.inject({ method: 'GET', url: '/' })
    assert.equal(open.statusCode, 200)
    assert.deepEqual(open.json(), { outcome: 'public' })

    const optional = await app.inject({ method: 'GET', url: '/optional' })
    assert.equal(optional.statusCode, 200)
    assert.deepEqual(optional.json(), { outcome: 'no session' })

    const denied = await app.inject({ method: 'GET', url: '/protected' })
    assert.equal(denied.statusCode, 401)
    assert.deepEqual(denied.json(), { message: 'unauthorised' })
  })

  await t.test('SuperTokens plugin handles its own route', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/signout' })
    assert.equal(response.statusCode, 401)
    assert.deepEqual(response.json(), { message: 'unauthorised' })
  })
})
