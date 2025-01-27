import { Reflector } from "@nestjs/core"

export const EmailVerified = Reflector.createDecorator<boolean>()
