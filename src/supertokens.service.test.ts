import { describe, it, expect, vi, beforeEach } from 'vitest'
import { plugin } from 'supertokens-node/framework/fastify'

import { SuperTokensService } from './supertokens.service'

vi.mock('supertokens-node', () => ({
  default: {
    init: vi.fn(),
  },
}))

const AppInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

const connectionUri =
  process.env.VITE_ST_CONNECTION_URI || 'http://localhost:4356'

describe('SuperTokensService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw when fastifyAdapter is missing', async () => {
    const service = new SuperTokensService({
      framework: 'fastify' as const,
      supertokens: {
        connectionURI: connectionUri,
      },
      appInfo: AppInfo,
      recipeList: [],
    })

    await expect(service.onModuleInit()).rejects.toThrow(
      'fastifyAdapter is required when using fastify as a framework',
    )
  })

  it('should register the fastify plugin when adapter is provided', async () => {
    const register = vi.fn()
    const service = new SuperTokensService({
      framework: 'fastify' as const,
      fastifyAdapter: { register } as any,
      supertokens: {
        connectionURI: connectionUri,
      },
      appInfo: AppInfo,
      recipeList: [],
    })

    await service.onModuleInit()

    expect(register).toHaveBeenCalledWith(plugin)
  })
})
