import { Reflector } from "@nestjs/core"

// TODO: Wrap with a utility function so that at least on property is required
type AuthOptions = {
  roles?: string[]
  permissions?: string[]
  requireEmailVerification?: boolean
  requireMFA?: boolean
}

export const AuthDecorator = Reflector.createDecorator<AuthOptions>()
