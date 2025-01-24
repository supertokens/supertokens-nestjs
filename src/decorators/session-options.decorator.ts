import { Reflector } from "@nestjs/core"
import { VerifySessionOptions } from "supertokens-node/recipe/session"

export const SessionOptions = Reflector.createDecorator<VerifySessionOptions>()
