import { Reflector } from "@nestjs/core"

type AuthOptions = {
  roles?: string[]
  permissions?: string[]
  requireEmailVerification?: boolean
  requireMFA?: boolean
}

export const Auth = Reflector.createDecorator<AuthOptions>()
