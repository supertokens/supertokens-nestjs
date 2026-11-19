import { Controller, Get } from '@nestjs/common'
import { PublicAccess, Session, VerifySession } from 'supertokens-nestjs'
import SessionRecipe from 'supertokens-node/recipe/session'
import type { TypeInput } from 'supertokens-node/types'

export function sessionOptions(): TypeInput {
  return {
    appInfo: {
      appName: 'Compatibility fixture',
      apiDomain: 'http://localhost:3001',
      websiteDomain: 'http://localhost:3000',
    },
    telemetry: false,
    supertokens: {
      connectionURI: 'http://127.0.0.1:1',
      networkInterceptor: () => {
        throw new Error('Compatibility tests must not contact Core')
      },
    },
    recipeList: [SessionRecipe.init()],
  }
}

@Controller()
export class SessionController {
  @PublicAccess()
  @Get()
  publicRoute() {
    return { outcome: 'public' }
  }

  @VerifySession({ options: { sessionRequired: false } })
  @Get('optional')
  optionalSession(@Session() session: unknown) {
    return { outcome: session === undefined ? 'no session' : 'session' }
  }

  @Get('protected')
  protectedRoute() {
    return { outcome: 'protected' }
  }
}
