import { Reflector } from "@nestjs/core"
import { VerifySessionOptions } from "supertokens-node/recipe/session"

// Sets custom session options
// that will be used by the AuthGuard when calling verifySession
export const SessionOptions = Reflector.createDecorator<VerifySessionOptions>()
