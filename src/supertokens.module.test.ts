import { describe, it, beforeAll, expect } from 'vitest'
import { Test } from '@nestjs/testing'
import Session from 'supertokens-node/recipe/session'

import { SuperTokensModule } from './supertokens.module'

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

// @ts-expect-error
const connectionUri = import.meta.env.VITE_ST_CONNECTION_URI || "http://localhost:4356"

describe('SuperTokensModule', () => {
  beforeAll(async () => {})

  it('should initialize with forRoot', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRoot({
          framework: 'express',
          supertokens: {
            connectionURI: connectionUri,
          },
          appInfo: AppInfo,
          recipeList: [Session.init()],
        }),
      ],
    }).compile()

    const app = moduleRef.createNestApplication()
    await app.init()
    const module = app.get(SuperTokensModule)
    expect(module).toBeDefined()
    await app.close()
  })

  it('should initialize with forRootAsync', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRootAsync({
          useFactory: async () => ({
            framework: 'express',
            supertokens: {
              connectionURI: connectionUri,
            },
            appInfo: AppInfo,
            recipeList: [Session.init()],
          }),
          inject: [],
        }),
      ],
    }).compile()

    const app = moduleRef.createNestApplication()
    await app.init()
    const module = app.get(SuperTokensModule)
    expect(module).toBeDefined()
    await app.close()
  })
})
