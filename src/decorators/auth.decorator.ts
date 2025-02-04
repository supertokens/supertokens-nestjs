import { Reflector } from "@nestjs/core"
import { AuthDecoratorOptions } from "../supertokens.types"

export const Auth = Reflector.createDecorator<AuthDecoratorOptions>()
