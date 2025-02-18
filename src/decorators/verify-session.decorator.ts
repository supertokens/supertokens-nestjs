import { Reflector } from '@nestjs/core'
import { VerifySessionDecoratorOptions } from '../supertokens.types'

export const VerifySession =
  Reflector.createDecorator<VerifySessionDecoratorOptions>()
