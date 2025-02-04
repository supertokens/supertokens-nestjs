import { Controller, Get } from '@nestjs/common'

import { PublicAccess, Auth, VerifySession } from 'supertokens-nestjs'

@Controller()
export class AppController {
  constructor() {}

  @Get()
  protectedRoute(): string {
    return 'protected'
  }

  @Get('/public')
  @PublicAccess()
  publicAccess(): string {
    return 'public'
  }

  @Get('/verify-session')
  @VerifySession()
  verifySession(): string {
    return 'verifySession'
  }

  @Get('/required-perission')
  @Auth({
    permissions: ['write'],
  })
  requiredPermission(): string {
    return 'requiredPermission'
  }

  @Get('/required-role')
  @Auth({
    roles: ['admin'],
  })
  requiredRole(): string {
    return 'requiredRole'
  }

  @Get('/skip-mfa')
  @Auth({
    requireMFA: false,
  })
  skipMFA(): string {
    return 'skipMFA'
  }

  @Get('/skip-emailverification')
  @Auth({
    requireEmailVerification: false,
  })
  skipEmailVerification(): string {
    return 'skipEmailVerification'
  }
}
